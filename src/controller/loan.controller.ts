import { Request, Response, NextFunction } from "express";
import { LoanServiceImpl } from "../service/impl/loan.service.impl";
import { CustomRequest } from "../middlewares/auth.middleware";
import { CreateLoanDTO } from "../dto/createLoan.dto";

export class LoanController{
    private loanService: LoanServiceImpl;

    constructor(){
        this.loanService = new LoanServiceImpl
    }

    public applyLoan = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
         try{
            const userId = parseInt(req.params.id)
            const loanData = req.body as CreateLoanDTO
            const loan = await this.loanService.applyLoan(userId, loanData)
            res.status(201).json({
                loan,
                message: "Loan applied successfully",
            })
         }catch(error){
            next(error)
         }
    }

    public getLoanById = async(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const loanId = parseInt(req.params.id)
            const loan = await this.loanService.getLoanById(loanId)
            res.status(200).json(loan)
        }catch(error){
            next(error)
        }
    }

    public getLoansforUser = async(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userId = parseInt(req.params.id)
            const loan = await this.loanService.getLoansForUser(userId)
            res.status(200).json(loan)
        }catch(error){
            next(error)
        }
    }

    public getAllLoans = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const loans = await this.loanService.getAllLoans()
            res.status(200).json(loans)
        }catch(error){
            next(error)
        }
    }

    public approveLoans = async(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const loanId = parseInt(req.params.id)
            const loanData = await this.loanService.approveLoan(loanId)
            res.status(200).json(loanData)
        }catch(error){
            next(error)
        }
    }

    public rejectLoans = async(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const loanId = parseInt(req.params.id)
            const loanData = await this.loanService.rejectLoan(loanId)
            res.status(200).json(loanData)
        }catch(error){
            next(error)
        }
    }

    public repayLoan = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const loanId = parseInt(req.params.id)
            const userId = parseInt(req.params.id)
            const amt = parseFloat(req.params.amount)
            const loanData = await this.loanService.recordLoanPayment(loanId, userId, amt)
            res.status(200).json(loanData)
        }catch(error){
            next(error)
        }
    }
}