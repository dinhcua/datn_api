/*
  Warnings:

  - You are about to drop the column `ward_id` on the `ward` table. All the data in the column will be lost.
  - Added the required column `district_id` to the `ward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ward" DROP CONSTRAINT "ward_ward_id_fkey";

-- AlterTable
ALTER TABLE "ward" DROP COLUMN "ward_id",
ADD COLUMN     "district_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ward" ADD CONSTRAINT "ward_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
