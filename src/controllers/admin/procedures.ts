import express from "express";
import NotFoundException from "../../exceptions/notFound";
import { BaseController } from "../abstractions/base";

export default class adminProcedureController extends BaseController {
  public path = "/api/admin/procedures";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/get", this.getAllProcedures);
  }

  getAllProcedures = async (
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
        await this.prisma.procedures.findMany({ where })
      ).length;
      const procedures = await this.prisma.procedures.findMany({
        where,
        skip,
        take: numPerPage,
        orderBy: { id: "asc" },
      });

      const data = await Promise.all(
        procedures.map(async (procedure) => {
          const field = await this.prisma.fields.findUnique({
            where: { id: procedure.id_field },
          });

          return { ...procedure, field };
        }),
      );

      const organizationsLength = procedures.length;
      const result = {
        current_page: numPage,
        data,
        from: organizationsLength ? 1 : 0,
        to: organizationsLength,
        total: totalOrganizations,
        next_page_url:
          procedures.length === numPerPage
            ? `http://localhost:8000/api/admin/procedures/get?page=${
                numPage + 1
              }&perPage=${numPerPage}`
            : null,
        prev_page_url:
          numPage > 1
            ? `http://localhost:8000/api/admin/procedures/get?page=${
                numPage - 1
              }&perPage=${numPerPage}`
            : null,
      };
      if (result) {
        response.json(result);
      } else {
        next(new NotFoundException());
      }
    }
  };
}
