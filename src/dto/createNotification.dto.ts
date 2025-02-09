import { NotificationType } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateNotificationDTO{
    @IsNotEmpty()
    message!: string

    @IsNotEmpty()
    @IsEnum(NotificationType)
    notificationType!: NotificationType

}