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
    this.router.get(this.path + "/get/:id", this.getProcedureById);
    this.router.post(this.path + "/add", this.addProcedure);
    this.router.post(this.path + "/options/add", this.addProcedureOption);
    this.router.get(
      this.path + "/options/get/:id_procedure",
      this.getOptionByProcedureId,
    );
    this.router.get(
      this.path + "/option/get/:id_option",
      this.getOptionByOptionId,
    );
    this.router.post(this.path + "/steps/add", this.addSteps);
    this.router.get(
      this.path + "/steps/get/:id_option",
      this.getStepsByOptionId,
    );
    this.router.get(this.path + "/step/get/:id_step", this.getStepById);
    this.router.put(this.path + "/steps/edit", this.editStepById);
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

  getProcedureById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_procedure = Number.parseInt(request.params.id);
    const procedure = await this.prisma.procedures.findUnique({
      where: { id: id_procedure },
    });
    const field = await this.prisma.fields.findUnique({
      where: { id: procedure?.id_field },
    });
    const data = { ...procedure, field };

    response.json({ success: true, data, message: "Thành công" });
  };

  addProcedure = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const reqBody = request.body;

    const thanh_phan_ho_so = reqBody.thanh_phan_ho_so;

    const procedure = await this.prisma.procedures.createMany({
      data: {
        id: Math.floor(Math.random() * 1000),
        key: reqBody.key,
        id_field: Number.parseInt(reqBody.id_field),
        name: reqBody.name,
        thanh_phan_ho_so,
        cach_thuc_thuc_hien: reqBody.cach_thuc_thuc_hien,
        doi_tuong_thuc_hien: reqBody.doi_tuong_thuc_hien,
        trinh_tu_thuc_hien: reqBody.trinh_tu_thuc_hien,
        thoi_han_giai_quyet: reqBody.thoi_han_giai_quyet,
        le_phi: reqBody.le_phi,
        so_luong_ho_so: Number.parseInt(reqBody.so_luong_ho_so),
        yeu_cau_dieu_kien: reqBody.yeu_cau_dieu_kien,
        can_cu_phap_ly: reqBody.can_cu_phap_ly,
        ket_qua_thuc_hien: reqBody.ket_qua_thuc_hien,
        // note: reqBody.note,
        level: 0,
      },
    });

    const result = {
      data: procedure,
      success: false,
      message: "Thêm thủ tục thành công",
    };

    if (procedure) {
      response.json(result);
    } else {
      next(new NotFoundException());
    }
  };

  addProcedureOption = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const reqBody = request.body;
    const addProcedureOption = await this.prisma.procedure_options.createMany({
      data: [
        {
          id_procedure: Number.parseInt(reqBody.id_procedure),
          id_template: 2,
          name: reqBody.name,
          processing_time: Number.parseInt(reqBody.processing_time),
        },
      ],
    });

    if (addProcedureOption) {
      response.json({ success: true, message: "Thành công" });
    }
  };

  getOptionByProcedureId = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_procedure = Number.parseInt(request.params.id_procedure);

    const option = await this.prisma.procedure_options.findFirst({
      where: { id_procedure },
    });

    if (!option) {
      response.json({
        message: "Thao tác thành công",
        success: true,
        data: 0,
      });
    } else {
      const template = await this.prisma.templates.findUnique({
        where: { id: 2 },
      });

      const procedure = await this.prisma.procedures.findUnique({
        where: { id: id_procedure },
      });

      const result = {
        message: "Thao tác thành công",
        success: true,
        data: {
          ...option,
          template,
          procedure,
        },
      };

      if (result) {
        response.json(result);
      } else {
        next(new NotFoundException());
      }
    }
  };

  getOptionByOptionId = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_option = Number.parseInt(request.params.id_option);

    const option = await this.prisma.procedure_options.findUnique({
      where: { id: id_option },
    });

    const procedure = await this.prisma.procedures.findUnique({
      where: {
        id: option?.id_procedure,
      },
    });

    response.json({ success: true, data: { ...option, procedure } });
  };

  addSteps = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const reqBody = request.body;
    const order = await this.prisma.procedure_steps.findMany({
      where: { id_option: Number.parseInt(reqBody.id_option) },
    });

    const step = await this.prisma.procedure_steps.createMany({
      data: [
        {
          id_procedure: Number.parseInt(reqBody.id_procedure),
          name: reqBody.name,
          note: reqBody.note,
          id_group: Number.parseInt(reqBody.id_group),
          id_option: Number.parseInt(reqBody.id_option),
          order: order.length + 1,
        },
      ],
    });

    const result = {
      message: "Thao tác thành công",
      success: true,
      data: step,
    };

    if (step) {
      response.json(result);
    } else {
      next(new NotFoundException());
    }
  };

  getStepsByOptionId = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_option = Number.parseInt(request.params.id_option);

    const steps = await this.prisma.procedure_steps.findMany({
      where: { id_option },
      orderBy: {
        order: "asc",
      },
    });

    const data = await Promise.all(
      steps.map(async (step) => {
        const group = await this.prisma.groups.findUnique({
          where: { id: step.id_group },
        });

        return { ...step, group };
      }),
    );

    const result = {
      message: "Thao tác thành công",
      success: true,
      data,
    };

    if (result) {
      response.json(result);
    } else {
      next(new NotFoundException());
    }
  };

  getStepById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_step = Number.parseInt(request.params.id_step);

    const step = await this.prisma.procedure_steps.findUnique({
      where: { id: id_step },
    });

    const group = await this.prisma.groups.findUnique({
      where: { id: step?.id_group },
    });

    const option = await this.prisma.procedure_options.findFirst({
      where: {
        id_procedure: step?.id_procedure,
      },
    });

    const data = { ...step, group, option };

    const result = {
      message: "Thao tác thành công",
      success: true,
      data,
    };

    if (result) {
      response.json(result);
    } else {
      next(new NotFoundException());
    }
  };

  editStepById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const reqBody = request.body;
    console.log(reqBody);
    const id_step = Number.parseInt(request.body.id);

    const updateStep = await this.prisma.procedure_steps.update({
      where: {
        id: id_step,
      },
      data: {
        id_group: Number.parseInt(reqBody.id_group),
        name: reqBody.name,
        note: reqBody.note,
      },
    });

    if (updateStep) {
      response.json({ success: true });
    } else {
      response.json({ success: false });
    }
  };
}
