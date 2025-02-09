import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport.config"
import "dotenv/config"
import { errorHandler } from "./utils/errorHandler.util";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import loanRoutes from "./routes/loan.route";
import notifyRoutes from "./routes/notification.route";
import { repayLoanCron } from "./cronJob/payment.cronJob";


dotenv.config()
repayLoanCron()

const portEnv = process.env.PORT;
if(!portEnv){
    console.error("Error: PORT is not defined in .env file");
    process.exit(1);
}

const PORT: number = parseInt(portEnv, 10);
if(isNaN(PORT)){
    console.error("Error: PORT is not a number in .env file");
    process.exit(1);
}

const app = express()
const corsOptions = {
    origin: 
    "*",
    credentials: true,
    allowedHeaders: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
}
app.use(session({
    secret: 'da5rk4mor3al6ly8greym3n',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24
    }   
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors(corsOptions));
app.use(express.json())

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/loans", loanRoutes)
app.use("/api/v1/notifications", notifyRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
});