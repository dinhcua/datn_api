"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const error_1 = __importDefault(require("./middlewares/error"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const utility_1 = require("./utility");
const seeding_1 = require("./utility/seeding");
let fileName;
class App {
    constructor(controllers, port) {
        this.handleUploadFile = async (request, response) => {
            const key = (0, utility_1.generateShortKey)(6);
            const access_key = (0, utility_1.generateShortKey)(10);
            const prisma = new client_1.PrismaClient();
            const reqBody = request.body;
            const reqUser = JSON.parse(request.body.user);
            const file = await prisma.files.create({
                data: {
                    id_procedure: Number.parseInt(reqBody.id_procedure),
                    id_option: Number.parseInt(reqBody.id_option),
                    id_user: Number.parseInt(reqUser.id),
                    id_step: Number.parseInt(reqBody.id_step),
                    key,
                    id_info_user: 1,
                    access_key,
                    processing_time: 720,
                    data_template: "data_template",
                    data: "data",
                },
            });
            const file_storage = await prisma.file_storage.create({
                data: {
                    title: fileName,
                    category: access_key,
                    path: `uploads/${reqUser.id}`,
                },
            });
            if (file && file_storage) {
                response.json({ data: { key, access_key } });
            }
        };
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.use(body_parser_1.default.urlencoded({ extended: false }));
        this.use(body_parser_1.default.json());
        this.app.use(express_1.default.json());
    }
    initializeErrorHandling() {
        this.app.use(error_1.default);
    }
    initializeControllers(controllers) {
        this.app.get("/", (request, response) => {
            response.send("Application is running");
        });
        const storage = multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                const reqUser = JSON.parse(req.body.user);
                const folderPath = `uploads/${reqUser.id}`;
                fs_1.default.mkdir(folderPath, { recursive: true }, (err) => {
                    if (err) {
                        console.error("Failed to create folder");
                        return;
                    }
                    cb(null, folderPath);
                });
            },
            filename: function (req, file, cb) {
                fileName = file.originalname;
                cb(null, file.originalname);
            },
        });
        const upload = (0, multer_1.default)({ storage });
        // this.app.post(
        //   "/api/files/submit",
        //   upload.single("file"),
        //   this.handleUploadFile,
        // );
        this.app.get("/seeding", seeding_1.seeding);
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
    use(mid) {
        this.app.use(mid);
    }
}
exports.default = App;
