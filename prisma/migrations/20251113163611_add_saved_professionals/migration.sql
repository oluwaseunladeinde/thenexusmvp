-- CreateTable
CREATE TABLE "saved_professionals" (
    "id" TEXT NOT NULL,
    "hrPartnerId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_professionals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_professionals_hrPartnerId_idx" ON "saved_professionals"("hrPartnerId");

-- CreateIndex
CREATE INDEX "saved_professionals_professionalId_idx" ON "saved_professionals"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_professionals_hrPartnerId_professionalId_key" ON "saved_professionals"("hrPartnerId", "professionalId");

-- AddForeignKey
ALTER TABLE "saved_professionals" ADD CONSTRAINT "saved_professionals_hrPartnerId_fkey" FOREIGN KEY ("hrPartnerId") REFERENCES "hr_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_professionals" ADD CONSTRAINT "saved_professionals_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
