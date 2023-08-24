/*
  Warnings:

  - You are about to drop the column `isTrash` on the `fields` table. All the data in the column will be lost.
  - The `data` column on the `files` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isTrash` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `isTrash` on the `info_user` table. All the data in the column will be lost.
  - You are about to drop the column `isTrash` on the `organization_field` table. All the data in the column will be lost.
  - You are about to drop the column `isTrash` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `isTrash` on the `procedures` table. All the data in the column will be lost.
  - The `thanh_phan_ho_so` column on the `procedures` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isTrash` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `id_organization` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isTrash` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fields" DROP COLUMN "isTrash";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "data_template" DROP NOT NULL,
DROP COLUMN "data",
ADD COLUMN     "data" TEXT[],
ALTER COLUMN "current_step" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "isTrash";

-- AlterTable
ALTER TABLE "info_user" DROP COLUMN "isTrash";

-- AlterTable
ALTER TABLE "organization_field" DROP COLUMN "isTrash";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "isTrash";

-- AlterTable
ALTER TABLE "procedures" DROP COLUMN "isTrash",
ADD COLUMN     "note" TEXT,
DROP COLUMN "thanh_phan_ho_so",
ADD COLUMN     "thanh_phan_ho_so" TEXT[];

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "isTrash";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "id_organization",
DROP COLUMN "isTrash",
ADD COLUMN     "id_group" INTEGER;
