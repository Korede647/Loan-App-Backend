import express from "express";
import { AuthController } from "../controller/auth.controller";
import passport from "passport";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.util";

const authController = new AuthController()
const authRoutes = express.Router()

authRoutes.post("/login", authController.login)
authRoutes.post("/signup", authController.createUser)
authRoutes.post("/verifyemail", authController.verifyEmail)
authRoutes.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))
// authRoutes.get("/google/callback", passport.authenticate("google", {session: false}),
//   (req, res)=> {
//       if(!req.user){
//         return res.redirect("/login")
//       }

//       const user = req.user as any
//       const token = generateAccessToken(user.id, user.name)
//       const refreshToken = generateRefreshToken(user.id, user.name)

//       res.redirect("https://www.google.com/")
//   }
// )

export default authRoutes