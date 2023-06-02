import dotenv from "dotenv";
import App from "./app";
import addressController from "./controllers/address";
import adminAuthController from "./controllers/admin/auth";
import adminFieldsController from "./controllers/admin/fields";
import adminGroupsController from "./controllers/admin/groups";
import adminOrganizationController from "./controllers/admin/organizations";
import adminProcedureController from "./controllers/admin/procedures";
import adminUserController from "./controllers/admin/user";
import authController from "./controllers/auth";
import fieldsController from "./controllers/fields";
import organizationController from "./controllers/organizations";
import proceduresController from "./controllers/procedures";
import FilesController from "./controllers/files";
import adminFilesController from "./controllers/admin/files";

dotenv.config();

const port = process.env.PORT || 3000;
const app = new App(
  [
    new authController(),
    new addressController(),
    new organizationController(),
    new proceduresController(),
    new fieldsController(),
    new adminAuthController(),
    new adminUserController(),
    new adminOrganizationController(),
    new adminFieldsController(),
    new adminProcedureController(),
    new adminGroupsController(),
    new FilesController(),
    new adminFilesController(),
  ],
  port,
);

app.listen();
