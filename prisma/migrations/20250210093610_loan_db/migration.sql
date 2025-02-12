-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'NOLOAN';

-- AlterTable
ALTER TABLE "Loans" ALTER COLUMN "status" SET DEFAULT 'NOLOAN';
