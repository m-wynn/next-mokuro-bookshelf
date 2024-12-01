-- AlterTable
ALTER TABLE "Volume" ADD COLUMN     "isEpub" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EPub" (
    "id" SERIAL NOT NULL,
    "volumeId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EPub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EPub_volumeId_key" ON "EPub"("volumeId");

-- AddForeignKey
ALTER TABLE "EPub" ADD CONSTRAINT "EPub_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EPub" ADD CONSTRAINT "EPub_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
