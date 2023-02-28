import express from "express";
import NotFoundException from "../exceptions/notFound";
import { BaseController } from "./abstractions/base";

export default class proceduresController extends BaseController {
  public path = "/api/procedures";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/get", this.getAllProcedures);
    this.router.get(this.path + "/get/:id", this.getProcedureById);
  }
  getAllProcedures = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { page, perPage, organization, search } = request.query;
    let organization_fields: any = [];

    if (typeof page === "string" && typeof perPage === "string") {
      const numPage = Number.parseInt(page);
      const numPerPage = Number.parseInt(perPage);

      if (typeof organization === "string") {
        organization_fields = await this.prisma.organization_field.findMany({
          where: { id_organization: Number.parseInt(organization) },
        });
      }
      const searchText =
        typeof search === "string"
          ? {
              OR: [
                { name: { contains: search } },
                { key: { contains: search } },
              ],
            }
          : {};

      const skip = (numPage - 1) * numPerPage;
      const where =
        organization_fields.length > 0
          ? Object.keys(searchText).length
            ? {
                id_field: {
                  in: organization_fields.map((field: any) => field.id_field),
                },
                searchText,
              }
            : {
                id_field: {
                  in: organization_fields.map((field: any) => field.id_field),
                },
              }
          : Object.keys(searchText).length > 0
          ? searchText
          : {};

      const totalProcedures = await (
        await this.prisma.procedures.findMany({ where })
      ).length;
      const procedures = await this.prisma.procedures.findMany({
        where,
        skip,
        take: numPerPage,
        orderBy: { id: "asc" },
      });

      const proceduresAndField = await Promise.all(
        procedures.map(async (procedure) => {
          const field = await this.prisma.fields.findUnique({
            where: { id: procedure.id_field },
          });
          return {
            ...procedure,
            field,
          };
        }),
      );

      const proceduresLength = procedures.length;
      const result = {
        current_page: numPage,
        data: proceduresAndField,
        from: proceduresLength ? 1 : 0,
        to: proceduresLength,
        total: totalProcedures,
        next_page_url:
          procedures.length === numPerPage
            ? `http://localhost:8000/api/procedures/get?page=${
                numPage + 1
              }&perPage=10`
            : null,
        prev_page_url:
          numPage > 1
            ? `http://localhost:8000/api/procedures/get?page=${
                numPage - 1
              }&perPage=10`
            : null,
      };
      response.json(result);
    }
  };

  getProcedureById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {};
}
