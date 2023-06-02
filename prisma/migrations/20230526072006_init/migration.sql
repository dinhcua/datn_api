/*
  Warnings:

  - You are about to drop the column `trye` on the `trash` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trash" DROP COLUMN "trye",
ADD COLUMN     "data" TEXT;
