-- AlterTable
ALTER TABLE "Loans" ALTER COLUMN "interest_rate" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "repayment_schedule" DROP NOT NULL;
