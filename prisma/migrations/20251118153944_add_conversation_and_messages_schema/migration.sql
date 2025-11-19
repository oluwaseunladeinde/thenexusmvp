/*
  Warnings:

  - A unique constraint covering the columns `[viewerHrId,viewedProfessionalId]` on the table `profile_views` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MessageSenderType" AS ENUM ('HR_PARTNER', 'PROFESSIONAL');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'CONVERSATION_STARTED';

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "introductionRequestId" TEXT NOT NULL,
    "hrPartnerId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderType" "MessageSenderType" NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_introductionRequestId_key" ON "conversations"("introductionRequestId");

-- CreateIndex
CREATE INDEX "conversations_hrPartnerId_idx" ON "conversations"("hrPartnerId");

-- CreateIndex
CREATE INDEX "conversations_professionalId_idx" ON "conversations"("professionalId");

-- CreateIndex
CREATE INDEX "conversations_status_idx" ON "conversations"("status");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "messages_sentAt_idx" ON "messages"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "profile_views_viewerHrId_viewedProfessionalId_key" ON "profile_views"("viewerHrId", "viewedProfessionalId");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_introductionRequestId_fkey" FOREIGN KEY ("introductionRequestId") REFERENCES "introduction_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_hrPartnerId_fkey" FOREIGN KEY ("hrPartnerId") REFERENCES "hr_partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
