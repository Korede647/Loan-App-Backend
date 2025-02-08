import { Request, Response, NextFunction } from "express";
import { AuthServiceImpl } from "../service/impl/auth.service.impl";
import { LoginDTO } from "../dto/login.dto";

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
}
