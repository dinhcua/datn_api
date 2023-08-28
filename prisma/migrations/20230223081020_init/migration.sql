-- Tạo một vai trò có quyền SELECT trên bảng info_user
CREATE ROLE readonly_role;
GRANT SELECT ON info_user TO readonly_role;

-- Tạo người dùng và gán vai trò cho họ
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT readonly_user TO info_user;

-- CreateTable
-- Tạo bảng thông tin người dùng
CREATE TABLE info_user (
    id SERIAL NOT NULL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    organization TEXT,
    identity_card TEXT,
    identity_card_date TIMESTAMP(3),
    identity_card_address TEXT NOT NULL,
    fax TEXT,
    website TEXT,
    ward TEXT,
    address TEXT
);

-- Tạo bảng dữ liệu nhạy cảm và sử dụng pgcrypto để mã hóa số thẻ tín dụng
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- Đảm bảo rằng pgcrypto đã được kích hoạt
CREATE TABLE sensitive_data (
    id SERIAL PRIMARY KEY,
    credit_card_number TEXT, -- Cột dữ liệu mã hóa
    name TEXT
);

-- Thêm mã hóa dữ liệu cho cột credit_card_number
UPDATE sensitive_data
SET credit_card_number = pgp_sym_encrypt('your_credit_card_number', 'your_encryption_key');
-- CreateTable
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "id_organization" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedures" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "id_field" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "thanh_phan_ho_so" TEXT NOT NULL,
    "cach_thuc_thuc_hien" TEXT,
    "doi_tuong_thuc_hien" TEXT,
    "trinh_tu_thuc_hien" TEXT,
    "thoi_han_giai_quyet" TEXT,
    "le_phi" TEXT,
    "so_luong_ho_so" INTEGER,
    "yeu_cau_dieu_kien" TEXT,
    "can_cu_phap_ly" TEXT,
    "ket_qua_thuc_hien" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "procedures_pkey" PRIMARY KEY ("id")
);

-- Tạo bảng dữ liệu nhạy cảm và sử dụng pgcrypto để mã hóa số thẻ tín dụng
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- Đảm bảo rằng pgcrypto đã được kích hoạt
CREATE TABLE sensitive_data (
    id SERIAL PRIMARY KEY,
    credit_card_number TEXT, -- Cột dữ liệu mã hóa
    name TEXT
);

-- Thêm mã hóa dữ liệu cho cột credit_card_number
UPDATE sensitive_data
SET credit_card_number = pgp_sym_encrypt('your_credit_card_number', 'your_encryption_key');

-- Tạo chỉ mục trên cột phone_number trong bảng info_user
CREATE INDEX idx_phone_number ON info_user (phone_number);

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure_options" (
    "id" SERIAL NOT NULL,
    "id_procedure" INTEGER NOT NULL,
    "id_template" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "processing_time" INTEGER NOT NULL,

    CONSTRAINT "procedure_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure_steps" (
    "id" SERIAL NOT NULL,
    "id_option" INTEGER NOT NULL,
    "id_group" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "procedure_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "id_procedure" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_option" INTEGER NOT NULL,
    "id_step" INTEGER NOT NULL,
    "id_info_user" INTEGER NOT NULL,
    "access_key" TEXT,
    "processing_time" INTEGER NOT NULL,
    "data_template" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "accepted_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_storage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "file_storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure_fs" (
    "id" SERIAL NOT NULL,
    "id_procedure" INTEGER NOT NULL,
    "id_fs" INTEGER NOT NULL,

    CONSTRAINT "procedure_fs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "organization_field" ADD CONSTRAINT "organization_field_id_organization_fkey" FOREIGN KEY ("id_organization") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_id_organization_fkey" FOREIGN KEY ("id_organization") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedures" ADD CONSTRAINT "procedures_id_field_fkey" FOREIGN KEY ("id_field") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_options" ADD CONSTRAINT "procedure_options_id_procedure_fkey" FOREIGN KEY ("id_procedure") REFERENCES "procedures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_options" ADD CONSTRAINT "procedure_options_id_template_fkey" FOREIGN KEY ("id_template") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_steps" ADD CONSTRAINT "procedure_steps_id_option_fkey" FOREIGN KEY ("id_option") REFERENCES "procedure_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_steps" ADD CONSTRAINT "procedure_steps_id_group_fkey" FOREIGN KEY ("id_group") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_id_procedure_fkey" FOREIGN KEY ("id_procedure") REFERENCES "procedures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_id_option_fkey" FOREIGN KEY ("id_option") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_id_step_fkey" FOREIGN KEY ("id_step") REFERENCES "procedure_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_id_info_user_fkey" FOREIGN KEY ("id_info_user") REFERENCES "info_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_fs" ADD CONSTRAINT "procedure_fs_id_procedure_fkey" FOREIGN KEY ("id_procedure") REFERENCES "procedures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_fs" ADD CONSTRAINT "procedure_fs_id_fs_fkey" FOREIGN KEY ("id_fs") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
