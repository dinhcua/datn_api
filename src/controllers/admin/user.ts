import express from "express";
import NotFoundException from "../../exceptions/notFound";
import { BaseController } from "../abstractions/base";
import dotenv from "dotenv";

dotenv.config();
export default class adminUserController extends BaseController {
  public path = "/api/admin/user";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/group", this.login);
  }

  login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    return response.json([]);
  };
}
