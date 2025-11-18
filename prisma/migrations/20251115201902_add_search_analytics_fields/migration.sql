-- AlterTable
ALTER TABLE "user_activity_logs" ADD COLUMN     "filtersUsed" JSONB,
ADD COLUMN     "resultsCount" INTEGER,
ADD COLUMN     "searchQuery" VARCHAR(500),
ADD COLUMN     "searchSessionId" VARCHAR(100);

-- CreateIndex
CREATE INDEX "user_activity_logs_searchSessionId_idx" ON "user_activity_logs"("searchSessionId");
