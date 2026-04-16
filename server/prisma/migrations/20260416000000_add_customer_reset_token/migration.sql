-- AlterTable: aggiungi campi reset password al Customer
ALTER TABLE "Customer" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "Customer" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
