import express from "express"
import isAdmin from "../middlewares/isAdmin"
import { NotificationController } from "../controller/notification.controller"

const notificationController = new NotificationController
const notifyRoutes = express.Router()

notifyRoutes.post("/", notificationController.createNotification)
notifyRoutes.get("/", notificationController.getAllNotification)
notifyRoutes.get("/:notifyId", notificationController.markNotification)


export default notifyRoutes