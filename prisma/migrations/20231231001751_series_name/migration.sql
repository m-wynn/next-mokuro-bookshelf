/*
  Warnings:

  - You are about to drop the column `name` on the `Series` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[english_name]` on the table `Series` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `english_name` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Series_name_key";

-- AlterTable
ALTER TABLE "Series" RENAME COLUMN  "name" TO "english_name";
ALTER TABLE "Series" ADD COLUMN     "japanese_name" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Series_english_name_key" ON "Series"("english_name");
