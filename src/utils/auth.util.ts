import Jwt  from "jsonwebtoken"

 export const generateAccessToken =(userId: number, name: string): string  =>{
    const expiresIn: any = process.env.JWT_ACCESS_EXPIRES || "2h";
            return Jwt.sign({id: userId, name}, process.env.JWT_SECRET || "", {
                expiresIn, 
            });
        }

  export const generateRefreshToken =(userId: number, name: string): string =>{
    const expiresIn: any = process.env.JWT_ACCESS_EXPIRES || "2h";
            return Jwt.sign({id: userId, name}, process.env.JWT_SECRET || "", {
                expiresIn,
            })
        }