-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "organization" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "identity_card" TEXT NOT NULL,
    "identity_card_date" TIMESTAMP(3) NOT NULL,
    "identity_card_address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "fax" TEXT,
    "website" TEXT,
    "ward" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,
    "remember_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_field" (
    "id" SERIAL NOT NULL,
    "id_organization" INTEGER NOT NULL,
    "id_field" INTEGER NOT NULL,

    CONSTRAINT "organization_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_identity_card_key" ON "users"("identity_card");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "organization_field" ADD CONSTRAINT "organization_field_id_field_fkey" FOREIGN KEY ("id_field") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
