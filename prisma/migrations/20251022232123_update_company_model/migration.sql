/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RemotePolicy" AS ENUM ('REMOTE_FIRST', 'HYBRID', 'OFFICE_FIRST');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "fundingStatus" TEXT,
ADD COLUMN     "location" JSONB,
ADD COLUMN     "remotePolicy" "RemotePolicy" NOT NULL DEFAULT 'HYBRID';

-- CreateIndex
CREATE UNIQUE INDEX "companies_domain_key" ON "companies"("domain");
