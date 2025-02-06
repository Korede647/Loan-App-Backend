
import dotenv from "dotenv";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";

dotenv.config()

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
           clientID: process.env.GOOGLE_CLIENT_ID || "",
           clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
           callbackURL: process.env.GOOGLE_CLIENT_REDIRECT_URL,
           passReqToCallback: true
        },
       async (
        req:Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback) => {
            try{
            let user = await prisma.user.findUnique({
                where: { 
                    googleId: profile.id
                },
            });
            if(!user){
                user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        firstName: profile.name?.givenName || "",
                        lastName: profile.name?.familyName || "",
                        email: profile.emails?.[0]?.value || "",
                }
            })
            done(null, user)
        }
    }catch (error){
    }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.googleId)
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ 
            where: { 
                googleId: id 
            }, 
            });
        done(null, user || null);
    } catch (error) {
        done(error, null);
    }
});

export default passport 