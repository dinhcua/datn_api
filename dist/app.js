"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_1 = __importDefault(require("./middlewares/error"));
class App {
    constructor(controllers, port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.app.use((0, cors_1.default)());
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
    }
    initializeErrorHandling() {
        this.app.use(error_1.default);
    }
    initializeControllers(controllers) {
        this.app.get("/", (request, response) => {
            response.send("Application is running");
        });
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
