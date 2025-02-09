
import { Notification } from "@prisma/client";
import { db } from "../../config/db";
import { CreateNotificationDTO } from "../../dto/createNotification.dto";
import { NotificationService } from "../notification.service";


export class NotificationServiceImpl implements NotificationService {
  async createNotification(
    userId: number,
    data: CreateNotificationDTO
  ): Promise<Notification> {
    const notification = await db.notification.create({
      data: {
        user_id: userId,
        message: data.message,
        notificationType: data.notificationType,
        is_read: false,
        createdAt: new Date()
      },
    });
    return notification;
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    const notifications = await db.notification.findMany({
      where: { 
        user_id: userId 
    },
      orderBy: { 
        createdAt: "desc" 
    },
    });
    return notifications;
  }

  async markNotificationAsRead(notificationId: number): Promise<Notification> {
    const updatedNotification = await db.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });
    return updatedNotification;
  }
}
