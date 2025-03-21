import { Request, Response, NextFunction } from "express";
import { UserServiceImpl } from "../service/impl/user.service.impl";
import { CreateUserDTO } from "../dto/createUser.dto";
import { ChangePasswordDTO } from "../dto/resetPassword.dto";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";

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

    public profile = async(
        req:CustomRequest,
        res:Response,
        next:NextFunction
    ): Promise<void | any> => {
        try{
            const id = req.userAuth;
            const user = await this.userService.getUserById(Number(id))

            res.status(StatusCodes.OK).json({
                error: false,
                message: "User profile retrieved successfully",
                data: user,
            });
    }catch(error){
        next(error)
    }
}

    public setPassword = async(
        req:CustomRequest,
        res:Response,
        next:NextFunction
    ): Promise<void> =>{
        try{
            const id = req.userAuth;
            const data = req.body as ChangePasswordDTO;
            const user = await this.userService.setPassword(Number(id), data);
            res.status(StatusCodes.OK).json({
                error: false,
                message: "Password changed successfully",
            })
        }catch(error){
            next(error)
        }
    }

    public updateProfilePic = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const userId = req.userAuth; 
          if (!req.file|| !req.file.path) {
            res.status(400).json({
              error: true,
              message: "No profile image uploaded",
            });
            return;
          }
      
          const profilePicUrl = req.file.path; // Cloudinary URL after upload
          await this.userService.updateProfilePic(Number(userId), {
            profilePic: profilePicUrl,
          });
      
          res.status(200).json({
            error: false,
            message: "Profile picture updated successfully",
            data: { profilePic: profilePicUrl },
          });
        } catch (error) {
          next(error);
        }
      };
}