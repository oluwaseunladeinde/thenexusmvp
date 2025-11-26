-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "verificationNotes" TEXT,
ADD COLUMN     "verifiedBy" TEXT;

-- AlterTable
ALTER TABLE "professionals" ADD COLUMN     "verificationNotes" TEXT,
ADD COLUMN     "verifiedBy" TEXT;
