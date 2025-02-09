import { Loans, Payment } from "@prisma/client";
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

        const interestRate = 9 / 100 
        const interestAmount = data.amount * interestRate
        const totalDue = data.amount + interestAmount
        const monthlyPayment = (totalDue) / data.tenure_months

        const baseDate = new Date()
        const schedule = Array.from({ length: data.tenure_months}, (_, i) => ({
            month: i + 1,
            dueDate: new Date(baseDate.setMonth(new Date().getMonth() + i + 1)),
            amountDue: monthlyPayment,
        }) )

        const loan = await db.loans.create({
            data: {
                userId: id,
                amount: data.amount,
                interest_rate: interestRate,
                tenure_months: data.tenure_months,
                totalAmtDue: totalDue,
                monthlyPay: monthlyPayment,
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

    async getLoansForUser(userId: number): Promise<Loans[]> {
        const loans = await db.loans.findMany({
            where:{
                userId
            },
            include: {
                Payment: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return loans
    }

    async getAllLoans(): Promise<Loans[]> {
        const loans = await db.loans.findMany({
            include: {
                Payment: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return loans
    }

    async approveLoan(loanId: number): Promise<Loans> {
        const loan = await db.loans.findUnique({
            where: {
                id: loanId
            }
        })

        if(!loan){
            throw new CustomError(StatusCodes.NOT_FOUND, "Loan does not exist")
        }
        if(loan.status !== "PENDING"){
            throw new CustomError(StatusCodes.FORBIDDEN, "Only Pending Loans can be approved")
        }
        const updateLoan = await db.loans.update({
            where: {
                id: loanId
            },
            data: {
                status: "APPROVED"
            }
        })
        // send email showing loan has been approved
        return updateLoan
    }

    async rejectLoan(loanId: number): Promise<Loans> {
        const loan = await db.loans.findUnique({
            where: {
                id: loanId
            }
        })

        if(!loan){
            throw new CustomError(StatusCodes.NOT_FOUND, "Loan does not exist")
        }
        if(loan.status !== "PENDING"){
            throw new CustomError(StatusCodes.FORBIDDEN, "Only Pending Loans can be rejected")
        }
        const updateLoan = await db.loans.update({
            where: {
                id: loanId
            },
            data: {
                status: "REJECTED"
            }
        })
      // send email showing loan has been rejected
        return updateLoan
    }

    async recordLoanPayment(loanId: number, userId: number, amount: number): Promise<Payment> {
        const loan = await db.loans.findUnique({
            where: {
                id: loanId
            }
        })
        if(!loan){
            throw new CustomError(StatusCodes.NOT_FOUND, "Loan does not exist")
        }

        if(loan.userId !== userId){
            throw new CustomError(StatusCodes.CONFLICT, "User does not own this loan")
        }

        const baseDate = loan.repayment_schedule;

        const paymentsMade = await db.payment.count({
            where:{
                loanId
            }
        })
        if (paymentsMade >= loan.tenure_months) {
            throw new CustomError(StatusCodes.BAD_REQUEST, "All payments have already been made.");
          }

        const schedule = Array.from({ length: loan.tenure_months}, (_, i) => ({
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
        }))
        const nextDueDate = schedule[paymentsMade].dueDate;

        const repayment = await db.payment.create({
            data: {
                loanId,
                userId,
                amount_paid: amount,
                due_date: nextDueDate,
                paid_on: new Date(),
                status: "PAID"
            }
        })

        const repayments = await db.payment.aggregate({
            where: {
                loanId
            },
            _sum: {
                amount_paid: true
            }
        })

       const totalPaid = repayments._sum.amount_paid || 0

       if (totalPaid >= Number(loan.totalAmtDue)) {
        await db.loans.update({
          where: { 
            id: loanId 
        },
          data: { 
            status: "PAID" 
        },
        });
      }
      // send email showing payment has been made for a month

      return repayment
    }
    
}