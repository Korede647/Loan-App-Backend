import express from "express"
import { LoanController } from "../controller/loan.controller"

const loanController = new LoanController
const loanRoutes = express.Router()

loanRoutes.post("/apply", loanController.applyLoan)

export default loanRoutes