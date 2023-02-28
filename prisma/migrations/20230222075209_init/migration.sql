-- CreateTable
CREATE TABLE "province" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255),

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255),
    "province_id" INTEGER NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ward" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255),
    "ward_id" INTEGER NOT NULL,

    CONSTRAINT "ward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ward" ADD CONSTRAINT "ward_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
