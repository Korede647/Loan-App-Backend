import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { LoginDTO } from "../../dto/login.dto";
import { VerifyEmailDTO } from "../../dto/verifyEmail.dto";
import { AuthService } from "../auth.service";
import Jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { comparePassword } from "../../utils/password.util";

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
  createUser(data: CreateUserDTO): Promise<User> {
    throw new Error("Method not implemented.");
  }
  verifyEmail(data: VerifyEmailDTO): Promise<User> {
    throw new Error("Method not implemented.");
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

