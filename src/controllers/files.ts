import express from "express";
import { BaseController } from "./abstractions/base";
import NotFoundException from "../exceptions/notFound";

export default class FilesController extends BaseController {
  public path = "/api/files";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/get-files", this.getFiles);
    this.router.get(this.path + "/get/:id", this.getFileById);
    this.router.get(this.path + "/get-file-steps/:id", this.getFileStepsById);
  }

  getFiles = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { page, perPage, id_user } = request.query;

    if (
      typeof page === "string" &&
      typeof perPage === "string" &&
      typeof id_user === "string"
    ) {
      const numPage = Number.parseInt(page);
      const numPerPage = Number.parseInt(perPage);
      const numIdUser = Number.parseInt(id_user);

      const skip = (numPage - 1) * numPerPage;
      // const where =
      //   organization_fields.length > 0
      //     ? Object.keys(searchText).length
      //       ? {
      //           id_field: {
      //             in: organization_fields.map((field: any) => field.id_field),
      //           },
      //           searchText,
      //         }
      //       : {
      //           id_field: {
      //             in: organization_fields.map((field: any) => field.id_field),
      //           },
      //         }
      //     : Object.keys(searchText).length > 0
      //     ? searchText
      //     : {};

      const totalFiles = await (
        await this.prisma.files.findMany({ where: { id_user: numIdUser } })
      ).length;

      const files = await this.prisma.files.findMany({
        where: { id_user: numIdUser },
        skip,
        take: numPerPage,
        orderBy: { id: "asc" },
      });

      const filesAndProcedure = await Promise.all(
        files.map(async (file) => {
          const procedure = await this.prisma.procedures.findUnique({
            where: { id: file.id_procedure },
          });
          return {
            ...file,
            procedure,
          };
        }),
      );

      const filesLength = files.length;
      const result = {
        current_page: numPage,
        data: filesAndProcedure,
        from: filesLength ? 1 : 0,
        to: filesLength,
        total: totalFiles,
        next_page_url:
          filesLength === numPerPage
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

  getFileById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_file = Number.parseInt(request.params.id);

    const file = await this.prisma.files.findUnique({
      where: {
        id: id_file,
      },
    });

    const procedure = await this.prisma.procedures.findUnique({
      where: {
        id: file?.id_procedure,
      },
    });

    const user_info = await this.prisma.info_user.findUnique({
      where: {
        id: file?.id_info_user,
      },
    });
    if (file?.access_key) {
      const files = await this.prisma.file_storage.findMany({
        where: { category: file.access_key },
      });
      const data = { ...file, procedure, user_info, files };

      response.json({ data });
    } else {
      const data = { ...file, procedure, user_info, files: [] };

      response.json({ data });
    }
  };

  getFileStepsById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_file = Number.parseInt(request.params.id);

    const file = await this.prisma.files.findUnique({ where: { id: id_file } });

    const steps = await this.prisma.procedure_steps.findMany({
      where: {
        id_option: 1,
      },
    });

    const user = await this.prisma.info_user.findUnique({
      where: {
        id: file?.id_info_user,
      },
    });

    const data = steps.map((step) => {
      return { step: { ...step }, user };
    });

    if (steps) {
      response.json({ data });
    }
  };
}
