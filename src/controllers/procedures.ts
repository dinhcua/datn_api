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
    this.router.get(this.path + "/get-by-key/:key", this.getProcedureByKey);
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
              }&perPage=${numPerPage}`
            : null,
        prev_page_url:
          numPage > 1
            ? `http://localhost:8000/api/procedures/get?page=${
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

  getProcedureById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const procedure_id = Number.parseInt(request.params.id);

    const procedure = await this.prisma.procedures.findUnique({
      where: {
        id: procedure_id,
      },
    });
    if (procedure) {
      response.json({
        success: true,
        data: procedure,
        message: "Thao tác thành công",
      });
    } else {
      next(new NotFoundException());
    }
  };

  getProcedureByKey = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const procedures = await this.prisma.procedures.findMany({
      where: {
        key: request.params.key,
      },
    });
    const procedureField = await Promise.all(
      procedures.map(async (procedure) => {
        const field = await this.prisma.fields.findUnique({
          where: { id: procedure.id_field },
        });

        const organization_fields =
          await this.prisma.organization_field.findMany({
            where: { id_field: procedure.id_field },
          });

        const first_organization = await this.prisma.organizations.findUnique({
          where: { id: organization_fields[0].id_organization },
        });

        const procedure_options = await this.prisma.procedure_options.findMany({
          where: { id_procedure: procedure.id },
        });
        console.log("isf", procedure.id);

        console.log("hhh", procedure_options.length);

        const options = await Promise.all(
          procedure_options.map(async (ProOption) => {
            const template = await this.prisma.templates.findUnique({
              where: { id: ProOption.id_template },
            });
            const procedure_steps = await this.prisma.procedure_steps.findMany({
              where: { id_option: ProOption.id },
            });
            console.log("procedure_steps", ProOption.id, procedure_steps);

            const steps = await Promise.all(
              procedure_steps.map(async (step) => {
                const group = await this.prisma.groups.findUnique({
                  where: { id: step.id_group },
                });
                return { ...step, group };
              }),
            );
            console.log(steps.length);

            return {
              ...ProOption,
              template,
              steps,
            };
          }),
        );

        return {
          ...procedure,
          field,
          eligible: true,
          first_organization,
          options,
        };
      }),
    );
    if (procedureField.length) {
      response.json({
        success: true,
        data: procedureField[0],
        message: "Thao tác thành công",
      });
    } else {
      next(new NotFoundException());
    }
  };
}
