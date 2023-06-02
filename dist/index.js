"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const address_1 = __importDefault(require("./controllers/address"));
const auth_1 = __importDefault(require("./controllers/admin/auth"));
const fields_1 = __importDefault(require("./controllers/admin/fields"));
const groups_1 = __importDefault(require("./controllers/admin/groups"));
const organizations_1 = __importDefault(require("./controllers/admin/organizations"));
const procedures_1 = __importDefault(require("./controllers/admin/procedures"));
const user_1 = __importDefault(require("./controllers/admin/user"));
const auth_2 = __importDefault(require("./controllers/auth"));
const fields_2 = __importDefault(require("./controllers/fields"));
const organizations_2 = __importDefault(require("./controllers/organizations"));
const procedures_2 = __importDefault(require("./controllers/procedures"));
const files_1 = __importDefault(require("./controllers/files"));
const files_2 = __importDefault(require("./controllers/admin/files"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const app = new app_1.default([
    new auth_2.default(),
    new address_1.default(),
    new organizations_2.default(),
    new procedures_2.default(),
    new fields_2.default(),
    new auth_1.default(),
    new user_1.default(),
    new organizations_1.default(),
    new fields_1.default(),
    new procedures_1.default(),
    new groups_1.default(),
    new files_1.default(),
    new files_2.default(),
], port);
app.listen();
