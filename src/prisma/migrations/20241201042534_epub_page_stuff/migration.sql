/*
  Warnings:

  - You are about to drop the column `isEpub` on the `Volume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reading" ADD COLUMN     "epubPage" TEXT;

-- AlterTable
ALTER TABLE "Volume" DROP COLUMN "isEpub";
