import express from "express"
import { LoanController } from "../controller/loan.controller"
import isAdmin from "../middlewares/isAdmin"

const loanController = new LoanController
const loanRoutes = express.Router()

loanRoutes.post("/apply", loanController.applyLoan)
loanRoutes.get("/:loanId", isAdmin, loanController.getLoanById)
loanRoutes.get("/", isAdmin, loanController.getAllLoans)
loanRoutes.get("/:userId/loans", loanController.getLoansforUser)
loanRoutes.patch("/:loanId/approve", isAdmin, loanController.approveLoans)
loanRoutes.patch("/:loanId/reject", loanController.rejectLoans)

loanRoutes.post("/:userId/:loanId/repay", loanController.repayLoan)

export default loanRoutes