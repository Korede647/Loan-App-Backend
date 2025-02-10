-- AlterTable
ALTER TABLE "User" ALTER COLUMN "otpExpiry" DROP DEFAULT,
ALTER COLUMN "resetPasswordTokenExpiry" DROP DEFAULT;
