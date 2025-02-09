import { Notification } from "@prisma/client";
import { CreateNotificationDTO } from "../dto/createNotification.dto";

export interface NotificationService {

    createNotification(userId: string, data: CreateNotificationDTO): Promise<any>;
    getNotifications(userId: string): Promise<Notification[]>;
    markNotificationAsRead(notificationId: string): Promise<any>;
  }
  