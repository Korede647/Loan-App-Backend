import { Notification } from "@prisma/client";
import { CreateNotificationDTO } from "../dto/createNotification.dto";

export interface NotificationService {

    createNotification(userId: number, data: CreateNotificationDTO): Promise<any>;
    getNotifications(userId: number): Promise<Notification[]>;
    markNotificationAsRead(notificationId: number): Promise<Notification>;
  }
  