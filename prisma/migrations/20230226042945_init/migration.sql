/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "organizations_key_key" ON "organizations"("key");
