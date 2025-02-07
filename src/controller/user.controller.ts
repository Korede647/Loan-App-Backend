import { Request, Response, NextFunction } from "express";
import { UserServiceImpl } from "../service/impl/user.service.impl";
import { CreateUserDTO } from "../dto/createUser.dto";

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
}