-- AlterTable
ALTER TABLE "Reading" ALTER COLUMN "useTwoPages" DROP NOT NULL,
ALTER COLUMN "useTwoPages" DROP DEFAULT,
ALTER COLUMN "firstPageIsCoverOverride" DROP NOT NULL,
ALTER COLUMN "firstPageIsCoverOverride" DROP DEFAULT;
