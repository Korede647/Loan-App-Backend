import { Request, Response, NextFunction } from "express";
import { AuthServiceImpl } from "../service/impl/auth.service.impl";
import { LoginDTO } from "../dto/login.dto";
import { StatusCodes } from "http-status-codes";
import { VerifyEmailDTO } from "../dto/verifyEmail.dto";
import { CreateUserDTO } from "../dto/createUser.dto";

export class AuthController {
    private authService : AuthServiceImpl

    constructor () {
        this.authService = new AuthServiceImpl
    }

    public login = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
         try{
            const userData = req.body as LoginDTO
            const user = await this.authService.login(userData)
            res.status(201).json({
                user,
                message: "User logged in successfully",
            })
         }catch(error){
            next(error)
         }
    }

    public createUser = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const data: CreateUserDTO = req.body;
          const user = await this.authService.createUser(data);
          res.status(201).json({
            error: false,
            message: `Otp has been sent successfully to your email @ ${user.email}`,
          });
        } catch (error) {
          next(error);
        }
      };

      public verifyEmail = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const data: VerifyEmailDTO = req.body;
          const user = await this.authService.verifyEmail(data);
          res.status(StatusCodes.CREATED).json({
            error: false,
            message: "You have successfully registered",
            data: user,
          });
        } catch (error) {
          next(error);
        }
      };
}
