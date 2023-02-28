import express from "express";
import NotFoundException from "../exceptions/notFound";
import { BaseController } from "./abstractions/base";

export default class fieldsController extends BaseController {
  public path = "/api/fields";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/get", this.getFields);
  }

  getFields = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { organization } = request.query;

    if (typeof organization === "string") {
      const organization_fields = await this.prisma.organization_field.findMany(
        {
          where: { id_organization: Number.parseInt(organization) },
        },
      );

      const data = await Promise.all(
        organization_fields.map(async (orgField) => {
          return await this.prisma.fields.findUnique({
            where: { id: orgField.id_field },
          });
        }),
      );

      if (data) {
        response.json({
          success: true,
          data,
          message: "Thao tác thành công",
        });
      } else {
        next(new NotFoundException());
      }
    }

    //
  };
}
