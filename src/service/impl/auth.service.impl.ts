import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { LoginDTO } from "../../dto/login.dto";
import { VerifyEmailDTO } from "../../dto/verifyEmail.dto";
import { AuthService } from "../auth.service";
import Jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { comparePassword, hashPassword } from "../../utils/password.util";
import { StatusCodes } from "http-status-codes";
import { generateOtp } from "../../utils/otp.util";

export class AuthServiceImpl implements AuthService {
  async login(
    data: LoginDTO
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new CustomError(401, "Invalid password or email");
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.password || ""
    );
    if (!isPasswordValid) {
      throw new CustomError(401, "Invalid password or email");
    }

    //
    const fullName = user.firstName + " " + user.lastName;
    const accessToken = this.generateAccessToken(user.id, fullName, user.role);

    const refreshToken = this.generateRefreshToken(
      user.id,
      fullName,
      user.role
    );

    return { accessToken, refreshToken };
  }

   async createUser(data: CreateUserDTO): Promise<User> {
        const otp = generateOtp();
        const isUserExist = await db.user.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (isUserExist) {
          throw new CustomError(409, "oops email already taken");
        }
    
        const hashedOtp = await hashPassword(otp);
        const maRetries = 3;
        for (let attempt = 1; attempt <= maRetries; attempt++) {
          try {
            return await db.$transaction(async (transaction) => {
              const user = await transaction.user.create({
                data: {
                  email: data.email,
                  password: await hashPassword(data.password),
                  firstName: data.firstName,
                  lastName: data.lastName,
                  role: data.role,
                  otp: hashedOtp,
                  otpExpiry: this.generateOtpExpiration(),
                },
              });
    
              // await sendOtpEmail({
              //   to: data.email,
              //   subject: "Verify your email",
              //   otp,
              // });
              return user;
            });
          } catch (error) {
            console.warn(`Retry ${attempt} due to transaction failure`, error);
            if (attempt === maRetries) {
              throw new CustomError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to create user after multiple retry"
              );
            }
          }
        }
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Unexpected error during user creation"
        );
    
       
      }

  async verifyEmail(data: VerifyEmailDTO): Promise<User> {
    const user = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
    }
    if (user.emailVerified) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
    }
    if (!user.otp || !user.otpExpiry) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "OTP is not available for this user"
      );
    }
    const isOtPValid = await comparePassword(data.otp, user.otp);
        if (!isOtPValid) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
        }
    
        const isExpiredOtp = user.otpExpiry < new Date();
    
        if (isExpiredOtp) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
        }
    
        const userReg = await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
            otp: null,
            otpExpiry: null,
          },
        });

        // await welcomeEmail({
        //   to: userReg.email,
        //   subject: "Welcome to Futurerify",
        //   name: userReg.firstName + " " + userReg.lastName,
        // });
    
        return userReg;
  }

  generateAccessToken(userId: number, name: string, role:string): string {
    const expiresIn: any = process.env.JWT_ACCESS_EXPIRES || "2h";
    return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
        expiresIn, 
    });
}

generateRefreshToken(userId: number, name: string, role: string): string{
  const expiresIn: any = process.env.JWT_ACCESS_EXPIRES || "30d";
    return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
        expiresIn, 
    })
}

  generateOtpExpiration() {
    return new Date(Date.now() + 10 * 60 * 1000);
  }
}

