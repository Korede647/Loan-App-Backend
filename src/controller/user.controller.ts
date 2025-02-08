import { Request, Response, NextFunction } from "express";
import { UserServiceImpl } from "../service/impl/user.service.impl";
import { CreateUserDTO } from "../dto/createUser.dto";
import { ChangePasswordDTO } from "../dto/resetPassword.dto";

export class UserController{
    private userService: UserServiceImpl;

    constructor(){
        this.userService = new UserServiceImpl()
    }

    public createUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userData = req.body as CreateUserDTO;
            const newUser = await this.userService.createUser(userData)
            res.status(201).json(newUser)
        }catch(error){
            next(error)
        }
    }

    public getUserById = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userId = parseInt(req.params.id)
            const userData = await this.userService.getUserById(userId)
            res.status(200).json(userData)
        }catch(error){
            next(error)
        }
    }

    public getAllUsers = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const allUsers = await this.userService.getAllUsers()
            res.status(200).json(allUsers)
        }catch(error){
            next(error)
        }
    }

    public updateUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userId = parseInt(req.params.id)
            const userData = req.body as Partial<CreateUserDTO>
            const user = await this.userService.updateUser(userId, userData)
            res.status(201).json(user)
        }catch(error){
            next(error)
        }
    }

    public deleteUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userId = parseInt(req.params.id)
            const userData = await this.userService.deleteUser(userId)
            res.status(200).json(userData)
        }catch(error){
            next(error)
        }
    }

    public setPassword = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        // try{
        //     const userId = parseInt(req.params.id)
        //     const userData = req.body as ChangePasswordDTO
        //     const user = await this.userService.setPassword(userId, userData)
        //     res.status(201).json({
                //  error: false
                // message: "Password Changed successfully"
            // })
        // }catch(error){
        //     next(error)
        // }
    }

    public updateProfilePic = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        // try{
        //     const userId = parseInt(req.params.id)
        //     const userPic = req.
        // }
    }
}