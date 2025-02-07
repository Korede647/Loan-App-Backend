import bcrypt from "bcryptjs"
// import { generateOtp } from "./otp.util";

const SALT_ROUNDS = 10;

// const otp = generateOtp()

export const hashPassword = async(password: string): Promise<string> => { // funtion to encrypt password
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (  // password inputed is raw, function to re-encrypt & compare password when user tries to log in
    password: string,
    hashPassword: string  
): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword)
}

// const hashOtp = await hashPassword(otp);
const maxRetries = 3;