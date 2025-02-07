import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDTO{
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @Length(6, 20)
    password!: string
}