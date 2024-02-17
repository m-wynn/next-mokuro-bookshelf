/*
  Warnings:

  - You are about to drop the column `isNsfw` on the `Volume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "isNsfw" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Volume" DROP COLUMN "isNsfw";
