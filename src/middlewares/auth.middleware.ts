import { NextFunction, Response, Request } from "express"
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request{
    userAuth?: string
}

export const authenticateUser = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): void => {
    try{
        const authHeader = req?.headers["authorization"] ;

        if(!authHeader){
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Authorization Required"
            });
            return;
        }
        const token = authHeader?.split(" ")[1];

        if(!token){
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Token is missing from authorization header",
            })
        }

        jwt.verify(token, process.env.JWT_SECRET || "", (err, decode) => {
            if(err){
                res.status(StatusCodes.FORBIDDEN).json({
                    message: "Invalid or expired token"
                })
                return;
            }

            const payload = decode as JwtPayload;
            req.userAuth = payload.id;
            next()
        })
    }catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error: error.message
        })
    }
}