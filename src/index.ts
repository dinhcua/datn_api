import dotenv from "dotenv";
import App from "./app";
import addressController from "./controllers/address";
import authController from "./controllers/auth";
import fieldsController from "./controllers/fields";
import organizationController from "./controllers/organizations";
import proceduresController from "./controllers/procedures";

dotenv.config();

const port = process.env.PORT || 3000;
const app = new App(
  [
    new authController(),
    new addressController(),
    new organizationController(),
    new proceduresController(),
    new fieldsController(),
  ],
  port,
);

app.listen();
