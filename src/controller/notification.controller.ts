import { Request, Response, NextFunction } from "express";
import { NotificationServiceImpl } from "../service/impl/notification.service.impl";
import { CreateNotificationDTO } from "../dto/createNotification.dto";

export class NotificationController {
  private notificationService: NotificationServiceImpl;

  constructor() {
    this.notificationService = new NotificationServiceImpl();
  }

  public createNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const notify = req.body as CreateNotificationDTO;
      const notifyData = await this.notificationService.createNotification(
        userId,
        notify
      );
      res.status(201).json(notifyData);
    } catch (error) {
      next(error);
    }
  };

  public getAllNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const notify = await this.notificationService.getNotifications(userId);
      res.status(200).json(notify);
    } catch (error) {
      next(error);
    }
  };

  public markNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const notifyId = parseInt(req.params.id);
      const notifyData =
        await this.notificationService.markNotificationAsRead(notifyId);
    } catch (error) {
      next(error);
    }
  };
}
