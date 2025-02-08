import { NextFunction, Response, Request } from "express";
import { StatusCodes } from "http-status-codes";

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if(req.isAuthenticated()){
        next();
    } else{
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Unauthorized"
        })
    }
}

