/*
  Warnings:

  - You are about to drop the column `volumeId` on the `Reading` table. Data that cannot be migrated to unique series will be lost.
  - A unique constraint covering the columns `[userId,seriesId]` on the table `Reading` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_volumeId_fkey";

-- DropIndex
DROP INDEX "Reading_userId_volumeId_key";

-- AlterTable
ALTER TABLE "Reading" ADD COLUMN     "seriesId" INTEGER,
ADD COLUMN     "volumeNum" INTEGER;

-- Add new columns
UPDATE "Reading"
SET "seriesId" = v."seriesId",
    "volumeNum" = v."number"
FROM "Volume" v
WHERE "Reading"."volumeId" = v.id;

-- Remove non-maximal volume numbers
DELETE FROM "Reading" r
WHERE EXISTS (
    SELECT 1
    FROM "Reading" r2
    WHERE r2."userId" = r."userId"
      AND r2."seriesId" = r."seriesId"
      AND r2."volumeNum" > r."volumeNum"
);

-- Remove old column
ALTER TABLE "Reading" DROP COLUMN "volumeId";

-- Add non-null constraints
ALTER TABLE "Reading" ALTER COLUMN "seriesId" SET NOT NULL;
ALTER TABLE "Reading" ALTER COLUMN "volumeNum" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reading_userId_seriesId_key" ON "Reading"("userId", "seriesId");

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_seriesId_volumeNum_fkey" FOREIGN KEY ("seriesId", "volumeNum") REFERENCES "Volume"("seriesId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
