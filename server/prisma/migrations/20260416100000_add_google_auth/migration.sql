-- AlterTable: rendi password e phone opzionali (per utenti Google/Apple)
ALTER TABLE "Customer" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "Customer" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable: aggiungi googleId univoco
ALTER TABLE "Customer" ADD COLUMN "googleId" TEXT;
CREATE UNIQUE INDEX "Customer_googleId_key" ON "Customer"("googleId");
