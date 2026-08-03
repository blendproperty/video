-- AlterTable
ALTER TABLE "Job" ADD COLUMN "listingId" TEXT;
ALTER TABLE "Job" ADD COLUMN "listingName" TEXT;

-- CreateIndex
CREATE INDEX "Job_listingId_idx" ON "Job"("listingId");
