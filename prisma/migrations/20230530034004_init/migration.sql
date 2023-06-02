-- AddForeignKey
ALTER TABLE "info_user" ADD CONSTRAINT "info_user_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_steps" ADD CONSTRAINT "procedure_steps_id_procedure_fkey" FOREIGN KEY ("id_procedure") REFERENCES "procedures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
