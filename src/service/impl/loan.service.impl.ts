import { Loans } from "@prisma/client";
import { db } from "../../config/db";
import { CreateLoanDTO } from "../../dto/createLoan.dto";
import { CustomError } from "../../exceptions/customError.error";
import { LoanService } from "../loan.service";
import { StatusCodes } from "http-status-codes";

export class LoanServiceImpl implements LoanService{
    async applyLoan(id: number, data: CreateLoanDTO): Promise<CreateLoanDTO> {
        const existingLoan = await db.loans.findFirst({
            where: {
                userId: id,
                status: {
                    in: [
                        "PENDING",
                        "APPROVED"
                    ]
                }
            }
        })

        if(existingLoan){
            throw new CustomError(409, "User already has an active Loan.")
        }

        const monthlyPayment = (data.amount * (1 + ((3/100 * data.amount)/ 100))) / data.tenure_months

        const schedule = Array.from({ length: data.tenure_months}, (_, i) => ({
            month: i + 1,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
            amountDue: monthlyPayment,
        }) )

        const loan = await db.loans.create({
            data: {
                userId: id,
                amount: data.amount,
                interest_rate: monthlyPayment,
                tenure_months: data.tenure_months,
                repayment_schedule: schedule,
                status: "PENDING"

            }
        })

        // send email confirming loan application

        return loan
    }

    async getLoanById(id: number): Promise<Loans> {
        const loan = await db.loans.findUnique({
            where: {
                id
            },
            include: {
                Payment: true
            },
        })

        if(!loan){
            throw new CustomError(StatusCodes.NOT_FOUND, "Loan not found")
        }
        
        return loan
    }
    getLoansForUser(userId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAllLoans(): Promise<Loans[]> {
        throw new Error("Method not implemented.");
    }
    approveLoan(loanId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rejectLoan(loanId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    recordLoanPayment(loanId: number, userId: number, amount: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}