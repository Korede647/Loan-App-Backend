// import Jwt  from "jsonwebtoken"

//  export const generateAccessToken =(userId: number, name: string): string  =>{
//             return Jwt.sign({id: userId, name}, process.env.JWT_SECRET || "", {
//                 expiresIn: process.env.JWT_ACCESS_EXPIRES, 
//             });
//         }

//   export const generateRefreshToken =(userId: number, name: string): string =>{
//             return Jwt.sign({id: userId, name}, process.env.JWT_SECRET || "", {
//                 expiresIn: process.env.JWT_REFRESH_EXPIRES
//             })
//         }