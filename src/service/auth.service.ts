import { User } from "@prisma/client";
import { CreateUserDTO } from "../dto/createUser.dto";
import { LoginDTO } from "../dto/login.dto";
import { VerifyEmailDTO } from "../dto/verifyEmail.dto"

export interface AuthService {
    login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }>;
    createUser(data: CreateUserDTO): Promise<User>;
    verifyEmail(data: VerifyEmailDTO): Promise<User>;
}