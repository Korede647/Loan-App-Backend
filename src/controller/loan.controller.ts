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
}