import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { ChangePasswordDTO } from "../../dto/resetPassword.dto";
import { UserService } from "../user.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../../utils/password.util";

export class UserServiceImpl implements UserService {
  async createUser(data: CreateUserDTO): Promise<User> {
    const isUserExist = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (isUserExist) {
      throw new CustomError(StatusCodes.CONFLICT, "Oops Email already exists");
    }

    const user = await db.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: await hashPassword(data.password),
        role: data.role,
        creditScore: data.creditScore,
      },
    });
    return user;
  }
  async getUserById(id: number): Promise<User | null> {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        `User with ${id} does not exist.`
      );
    }
    return user;
  }
  async getAllUsers(): Promise<User[]> {
    return await db.user.findMany();
  }
  async updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "User does not exist");
    }
    await db.user.update({
      where: {
        id,
      },
      data,
    });
    throw new Error("Method not implemented.");
  }
  async deleteUser(id: number): Promise<void> {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
    }
    await db.user.delete({
      where: {
        id,
      },
    });
  }
  async profile(id: number): Promise<Omit<User, "password">> {
    throw new Error("Method not implemented.");
  }
  async setPassword(id: number, data: ChangePasswordDTO): Promise<void> {
    await db.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
      }

      const isPasswordValid = await comparePassword(
        data.oldPassword,
        user.password || ""
      );

      if (!isPasswordValid) {
        throw new CustomError(400, "Current password is incorrect");
      }
      const hashedPassword = await hashPassword(data.newPassword);

      await transaction.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });

      //   await sendPasswordChangeEmail ({
      //     to: user.email,
      //     subject: "Password Change Verification",
      //     name: user.firstName + " " + user.lastName
      //   })
    });
  }
  async updateProfilePic(
    id: number,
    data: { profilePic: string }
  ): Promise<Object | any> {
    const user = await db.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
    }
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: { profilePicture: data.profilePic },
    });

    //return updateuser without sensitive fields like password
    return {
      id: updatedUser.id,
      name: updatedUser.firstName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    };
  }
}
