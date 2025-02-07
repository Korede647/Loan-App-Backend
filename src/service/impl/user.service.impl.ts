import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { ChangePasswordDTO } from "../../dto/resetPassword.dto";
import { UserService } from "../user.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { hashPassword } from "../../utils/password.util";

export class UserServiceImpl implements UserService{
    async createUser(data: CreateUserDTO): Promise<User> {
        const isUserExist = await db.user.findFirst({
            where: {
                email: data.email,
            }
        })

        if(isUserExist){
            throw new CustomError(StatusCodes.CONFLICT, "Oops Email already exists")
        }

        const user = await db.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: await hashPassword(data.password),
                role: data.role,
                creditScore: data.creditScore
            }
        })
        return user;
    }
    getUserById(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    getAllUsers(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
        throw new Error("Method not implemented.");
    }
    deleteUser(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    profile(id: number): Promise<Omit<User, "password">> {
        throw new Error("Method not implemented.");
    }
    setPassword(id: number, data: ChangePasswordDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateProfilePic(id: number, data: { profilePic: string; }): Promise<Object | any> {
        throw new Error("Method not implemented.");
    }

}