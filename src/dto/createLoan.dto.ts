import { PaymentMethod, Status } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateLoanDTO{
    @IsNotEmpty()
    amount!: number

    @IsNotEmpty()
    tenure_months!: number

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    payment_method!: PaymentMethod

}