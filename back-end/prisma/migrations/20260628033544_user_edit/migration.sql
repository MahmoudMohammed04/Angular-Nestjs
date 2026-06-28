-- AlterTable
ALTER TABLE "User" ALTER COLUMN "is_email_confirmed" SET DEFAULT false,
ALTER COLUMN "email_confirm_cod" DROP NOT NULL,
ALTER COLUMN "google_id" DROP NOT NULL,
ALTER COLUMN "rest_password_cod" DROP NOT NULL;
