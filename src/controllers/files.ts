import express from "express";
import { BaseController } from "./abstractions/base";
import NotFoundException from "../exceptions/notFound";
import { generateShortKey } from "../utility";

export default class FilesController extends BaseController {
  public path = "/api/files";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/get", this.search);
    this.router.get(this.path + "/get-files", this.getFiles);
    this.router.get(this.path + "/get/:id", this.getFileById);
    this.router.get(this.path + "/get-file-steps/:id", this.getFileStepsById);
    this.router.post(this.path + "/submit", this.submitFile);
    this.router.post(this.path + "/cancel", this.cancelFile);
  }

  search = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { page, perPage, key, identity_card } = request.query;
    if (typeof perPage === "string" && typeof page === "string") {
      const numPage = Number.parseInt(page);
      const numPerPage = Number.parseInt(perPage);

      const skip = (numPage - 1) * numPerPage;

      let files: any = [];

      if (typeof key === "string" && typeof identity_card === "string") {
        if (key === "" && identity_card !== "") {
          const user = await this.prisma.users.findFirst({
            where: {
              identity_card,
            },
          });

          if (!user) return;

          files = await this.prisma.files.findMany({
            where: {
              id_user: user.id,
            },
            skip,
            take: numPerPage,
            orderBy: { id: "asc" },
          });
        } else if (key !== "" && identity_card === "") {
          files = await this.prisma.files.findMany({
            where: {
              key,
            },
            skip,
            take: numPerPage,
            orderBy: { id: "asc" },
          });
        } else {
          const user = await this.prisma.users.findFirst({
            where: {
              identity_card,
            },
          });
          if (!user) return;

          files = await this.prisma.files.findMany({
            where: {
              id_user: user.id,
              key,
            },
            skip,
            take: numPerPage,
            orderBy: { id: "asc" },
          });
        }
      }

      const totalFiles = files.length;

      const filesAndProcedure = await Promise.all(
        files.map(async (file: any) => {
          const procedure = await this.prisma.procedures.findUnique({
            where: { id: file.id_procedure },
          });
          const user = await this.prisma.users.findUnique({
            where: { id: file.id_user },
          });
          return {
            ...file,
            procedure,
            user,
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
            ? `http://localhost:8000/api/files/get?page=${
                numPage + 1
              }&perPage=${numPerPage}`
            : null,
        prev_page_url:
          numPage > 1
            ? `http://localhost:8000/api/files/get?page=${
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
          const user = await this.prisma.users.findUnique({
            where: { id: file.id_user },
          });
          return {
            ...file,
            procedure,
            user,
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
      orderBy: {
        order: "asc",
      },
    });

    const stepsFinished = steps.slice(0, file?.current_step);

    const data = await Promise.all(
      stepsFinished.map(async (step) => {
        const user = await this.prisma.users.findFirst({
          where: {
            id_group: step.id_group,
            // id_organization: step.id_group,
          },
        });
        return { step: { ...step }, user };
      }),
    );

    if (steps) {
      response.json({ data });
    }
  };

  submitFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const key = generateShortKey(6);
    const access_key = generateShortKey(10);

    const reqBody = request.body;

    const option = reqBody.option.steps.find((step: any) => {
      return step.order === 1;
    });

    // const thanh_phan_ho_so = reqBody.procedure.thanh_phan_ho_so;
    const data_thanh_phan_ho_so = reqBody.file.thanh_phan_ho_so;

    const steps = await this.prisma.procedure_steps.findMany({
      where: { id_procedure: reqBody.file.id_procedure },
    });

    const current_step = steps.find((step: any) => step.order === 1);

    if (!current_step) return;
    const infoUser = await this.prisma.info_user.findFirst({
      where: {
        id_user: reqBody.user.id,
      },
    });
    // console.log(infoUser);

    if (!infoUser) return;
    // console.log("reqBody", reqBody);

    // console.log("reqBody.procedure.id", reqBody.procedure.id);

    const file = await this.prisma.files.create({
      data: {
        id_procedure: Number.parseInt(reqBody.procedure.id),
        id_option: option.id_group,
        id_user: reqBody.user.id,
        id_step: option?.id,
        key,
        current_step: 1,
        id_info_user: infoUser.id,
        access_key,
        processing_time: reqBody.option.processing_time,
        data_template: "",
        data: data_thanh_phan_ho_so,
      },
    });
    if (file) {
      response.json({
        data: { key, access_key },
        success: true,
        message: "Nộp hồ sơ thành công",
      });
    } else {
      response.json({
        success: false,
        message: "Nộp hồ sơ thất bại",
      });
    }
  };

  cancelFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_file = Number.parseInt(request.body.id);
    const deleteFile = await this.prisma.files.delete({
      where: {
        id: id_file,
      },
    });

    if (deleteFile) {
      response.json({ success: true, message: "Huỷ hồ sơ thành công" });
    }
  };
}
