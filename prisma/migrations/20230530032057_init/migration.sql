/*
  Warnings:

  - You are about to drop the `trash` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_user` to the `info_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_procedure` to the `procedure_steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fields" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "members" TEXT;

-- AlterTable
ALTER TABLE "info_user" ADD COLUMN     "id_organization" INTEGER,
ADD COLUMN     "id_user" INTEGER NOT NULL,
ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "organization_field" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "procedure_steps" ADD COLUMN     "id_procedure" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "procedures" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "id_organization" INTEGER,
ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "trash";

-- AddForeignKey
ALTER TABLE "info_user" ADD CONSTRAINT "info_user_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_steps" ADD CONSTRAINT "procedure_steps_id_procedure_fkey" FOREIGN KEY ("id_procedure") REFERENCES "procedures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
