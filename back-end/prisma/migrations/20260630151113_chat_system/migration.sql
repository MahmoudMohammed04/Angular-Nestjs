/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_code_expired` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_confirm_code` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_email_confirmed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `normalized_email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `normalized_username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_code_expired` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rest_password_code` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `normalizedUsername` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationRole" AS ENUM ('member', 'admin', 'owner');

-- CreateEnum
CREATE TYPE "MessageStatusType" AS ENUM ('None', 'Seen', 'delivered');

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_google_id_key";

-- DropIndex
DROP INDEX "User_normalized_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "email_code_expired",
DROP COLUMN "email_confirm_code",
DROP COLUMN "google_id",
DROP COLUMN "is_email_confirmed",
DROP COLUMN "normalized_email",
DROP COLUMN "normalized_username",
DROP COLUMN "password_code_expired",
DROP COLUMN "password_hash",
DROP COLUMN "refresh_token",
DROP COLUMN "rest_password_code",
DROP COLUMN "role",
ADD COLUMN     "normalizedUsername" TEXT NOT NULL,
ADD COLUMN     "pictureUrl" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "isGroup" BOOLEAN NOT NULL,
    "lastMessageId" INTEGER NOT NULL,
    "lastMessageTime" TIMESTAMP(3) NOT NULL,
    "membersCount" INTEGER NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMember" (
    "userId" TEXT NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "role" "ConversationRole" NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadedMessageId" INTEGER NOT NULL,
    "lastDeliveredMessageId" INTEGER NOT NULL,

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("userId","conversationId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "conversationMembersCount" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageFile" (
    "id" SERIAL NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "MessageFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageStatus" (
    "messageId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "MessageStatusType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageStatus_pkey" PRIMARY KEY ("messageId","userId")
);

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_lastReadedMessageId_fkey" FOREIGN KEY ("lastReadedMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_lastDeliveredMessageId_fkey" FOREIGN KEY ("lastDeliveredMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageFile" ADD CONSTRAINT "MessageFile_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageStatus" ADD CONSTRAINT "MessageStatus_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageStatus" ADD CONSTRAINT "MessageStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
