import express from "express";
import NotFoundException from "../exceptions/notFound";
import { BaseController } from "./abstractions/base";

export default class organizationController extends BaseController {
  public path = "/api/organizations";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/get-group-fields", this.getGroupFields);
    this.router.get(this.path + "/get", this.getAllOrganizations);
  }
  getGroupFields = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const organizations = await this.prisma.organizations.findMany({});
    const data = await Promise.all(
      organizations.map(async (organization) => {
        const organizationsFields =
          await this.prisma.organization_field.findMany({
            where: { id_organization: organization.id },
          });
        const fields = await Promise.all(
          organizationsFields.map(async (field) => {
            const data = await this.prisma.fields.findUnique({
              where: { id: field.id_field },
            });
            if (data) {
              const procedures = await this.prisma.procedures.findMany({
                where: { id_field: field.id_field },
              });
              return {
                ...data,
                count_procedures: procedures.length,
                pivot: {
                  id_organization: organization.id,
                  id_field: field.id_field,
                },
              };
            }
          }),
        );
        return {
          ...organization,
          fields,
        };
      }),
    );

    if (data) {
      response.json({ success: true, data, message: "Thao tác thành công" });
    } else {
      next(new NotFoundException());
    }
  };
  getAllOrganizations = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const organizations = await this.prisma.organizations.findMany({});
    response.json({
      success: true,
      data: organizations,
      message: "Thao tác thành công",
    });
  };
}
