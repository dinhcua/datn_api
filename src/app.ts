import express from "express";
import cors from "cors";
import { BaseController } from "./controllers/abstractions/base";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/error";
import multer from "multer";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

import { generateShortKey } from "./utility";
import { seeding } from "./utility/seeding";

let fileName: string;
class App {
  public app: express.Application;
  public port: number | string;
  constructor(controllers: BaseController[], port: number | string) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.use(bodyParser.urlencoded({ extended: false }));
    this.use(bodyParser.json());
    this.app.use(express.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private handleUploadFile = async (
    request: express.Request,
    response: express.Response,
  ) => {
    const key = generateShortKey(6);
    const access_key = generateShortKey(10);
    const prisma = new PrismaClient();

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

  private initializeControllers(controllers: BaseController[]) {
    this.app.get("/", (request, response) => {
      response.send("Application is running");
    });

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const reqUser = JSON.parse(req.body.user);
        const folderPath = `uploads/${reqUser.id}`;
        fs.mkdir(folderPath, { recursive: true }, (err) => {
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
    const upload = multer({ storage });

    this.app.post(
      "/api/files/submit",
      upload.single("file"),
      this.handleUploadFile,
    );

    this.app.get("/seeding", seeding);

    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
  public use(mid: any) {
    this.app.use(mid);
  }
}

export default App;
