/*
  Warnings:

  - You are about to drop the column `english_name` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `japanese_name` on the `Series` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[englishName]` on the table `Series` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `englishName` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Series_english_name_key";

-- AlterTable
ALTER TABLE "Series" RENAME COLUMN "english_name" TO "englishName";
ALTER TABLE "Series" RENAME COLUMN "japanese_name" TO "japaneseName";

-- CreateIndex
CREATE UNIQUE INDEX "Series_englishName_key" ON "Series"("englishName");
