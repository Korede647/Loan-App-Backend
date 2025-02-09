-- AlterEnum
ALTER TYPE "PaidStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "payment_method" DROP NOT NULL;
