import { Loans } from "@prisma/client";
import { CreateLoanDTO } from "../dto/createLoan.dto";

export interface LoanService {
    applyLoan(id: number, data: CreateLoanDTO): Promise<CreateLoanDTO> // apply for new loan
    getLoanById(id: number): Promise<Loans> // get single loan
    getLoansForUser(userId: number): Promise<void> // specific user get loan
    getAllLoans(): Promise<Loans[]>
    approveLoan(loanId: number): Promise<void> // approve pending loan
    rejectLoan(loanId: number): Promise<void> // reject pending loan
    recordLoanPayment(loanId: number, userId: number, amount: number): Promise<void> // Record a repayment for a loan and update its status if fully paid.
}