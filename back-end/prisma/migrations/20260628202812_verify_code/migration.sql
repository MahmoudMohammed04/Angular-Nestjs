/*
  Warnings:

  - You are about to drop the column `email_confirm_cod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rest_password_cod` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "email_confirm_cod",
DROP COLUMN "rest_password_cod",
ADD COLUMN     "email_code_expired" TIMESTAMP(3),
ADD COLUMN     "email_confirm_code" TEXT,
ADD COLUMN     "password_code_expired" TIMESTAMP(3),
ADD COLUMN     "rest_password_code" TEXT;
