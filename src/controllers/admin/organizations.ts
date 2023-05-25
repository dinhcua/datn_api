import express from "express";
import NotFoundException from "../../exceptions/notFound";
import { BaseController } from "../abstractions/base";

export default class adminOrganizationController extends BaseController {
  public path = "/api/admin/organizations";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/get", this.getAllOrganizations);
    this.router.get(this.path + "/get/:id", this.getOrganizationById);
    this.router.get(this.path + "/get-group-fields", this.getGroupFields);
    this.router.get(this.path + "/get-groups", this.getGroups);
  }

  getAllOrganizations = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { page, perPage, q } = request.query;

    if (typeof page === "string" && typeof perPage === "string") {
      const numPage = Number.parseInt(page);
      const numPerPage = Number.parseInt(perPage);

      const searchText =
        typeof q === "string"
          ? {
              OR: [{ name: { contains: q } }, { key: { contains: q } }],
            }
          : {};

      const skip = (numPage - 1) * numPerPage;
      const where = Object.keys(searchText).length > 0 ? searchText : {};

      const totalOrganizations = await (
        await this.prisma.organizations.findMany({ where })
      ).length;
      const organizations = await this.prisma.organizations.findMany({
        where,
        skip,
        take: numPerPage,
        orderBy: { id: "asc" },
      });

      const organizationsLength = organizations.length;
      const result = {
        current_page: numPage,
        data: organizations,
        from: organizationsLength ? 1 : 0,
        to: organizationsLength,
        total: totalOrganizations,
        next_page_url:
          organizations.length === numPerPage
            ? `http://localhost:8000/api/admin/organizations/get?page=${
                numPage + 1
              }&perPage=${numPerPage}`
            : null,
        prev_page_url:
          numPage > 1
            ? `http://localhost:8000/api/admin/organizations/get?page=${
                numPage - 1
              }&perPage=${numPerPage}`
            : null,
      };
      if (result) {
        response.json(result);
      } else {
        next(new NotFoundException());
      }
    } else {
      const organizations = await this.prisma.organizations.findMany();
      if (organizations) {
        response.json({
          success: true,
          data: organizations,
          message: "Thao tác thành công",
        });
      } else {
        next(new NotFoundException());
      }
    }
  };

  getOrganizationById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const organization_id = Number.parseInt(request.params.id);

    const organization = await this.prisma.organizations.findUnique({
      where: {
        id: organization_id,
      },
    });
    if (organization) {
      response.json({
        success: true,
        data: organization,
        message: "Thao tác thành công",
      });
    } else {
      next(new NotFoundException());
    }
  };

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

  getGroups = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const organizations = await this.prisma.organizations.findMany();

    const result = await Promise.all(
      organizations.map(async (organization) => {
        const groups = await this.prisma.groups.findMany({
          where: { id_organization: organization.id },
        });
        return { ...organization, groups };
      }),
    );

    if (result) {
      response.json({
        success: true,
        data: result,
        message: "Thao tác thành công",
      });
    } else {
      next(new NotFoundException());
    }
  };
}
