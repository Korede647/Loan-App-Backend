-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'NULL';

-- AlterTable
ALTER TABLE "Loans" ALTER COLUMN "status" SET DEFAULT 'NULL';
