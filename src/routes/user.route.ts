import express from "express"
import { UserController } from "../controller/user.controller";

const userController = new UserController()
const userRoutes = express.Router()

userRoutes.post("/create", userController.createUser)
userRoutes.get("/:id", userController.getUserById)
userRoutes.get("/", userController.getAllUsers)
userRoutes.patch("/update/:id", userController.updateUser)