import express from "express"
import { UserController } from "../controller/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import isAdmin from "../middlewares/isAdmin";
import { uploadToCloudinaryProfileImage } from "../config/cloudinary.config";

const userController = new UserController()
const userRoutes = express.Router()

userRoutes.post("/create", userController.createUser)
userRoutes.get("/:id", userController.getUserById)
userRoutes.get("/auth/profile", authenticateUser, userController.profile)
userRoutes.get("/", authenticateUser, isAdmin, userController.getAllUsers)
userRoutes.patch("/profile-pic", authenticateUser, uploadToCloudinaryProfileImage, userController.updateProfilePic)
userRoutes.patch("/update/:id", authenticateUser, userController.updateUser)
userRoutes.get("/delete/:id", authenticateUser, userController.deleteUser)

export default userRoutes