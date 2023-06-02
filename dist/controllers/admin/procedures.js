"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
const docx_1 = require("docx");
const fs = require("fs");
class adminProcedureController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/procedures";
        this.getAllProcedures = async (request, response, next) => {
            const { page, perPage, q } = request.query;
            if (typeof page === "string" && typeof perPage === "string") {
                const numPage = Number.parseInt(page);
                const numPerPage = Number.parseInt(perPage);
                const searchText = typeof q === "string"
                    ? {
                        OR: [{ name: { contains: q } }, { key: { contains: q } }],
                    }
                    : {};
                const skip = (numPage - 1) * numPerPage;
                const where = Object.keys(searchText).length > 0 ? searchText : {};
                const totalOrganizations = await (await this.prisma.procedures.findMany({ where })).length;
                const procedures = await this.prisma.procedures.findMany({
                    where,
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                const data = await Promise.all(procedures.map(async (procedure) => {
                    const field = await this.prisma.fields.findUnique({
                        where: { id: procedure.id_field },
                    });
                    return { ...procedure, field };
                }));
                const organizationsLength = procedures.length;
                const result = {
                    current_page: numPage,
                    data,
                    from: organizationsLength ? 1 : 0,
                    to: organizationsLength,
                    total: totalOrganizations,
                    next_page_url: procedures.length === numPerPage
                        ? `http://localhost:8000/api/admin/procedures/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/admin/procedures/get?page=${numPage - 1}&perPage=${numPerPage}`
                        : null,
                };
                if (result) {
                    response.json(result);
                }
                else {
                    next(new notFound_1.default());
                }
            }
        };
        this.getProcedureById = async (request, response, next) => {
            const id_procedure = Number.parseInt(request.params.id);
            const procedure = await this.prisma.procedures.findUnique({
                where: { id: id_procedure },
            });
            const field = await this.prisma.fields.findUnique({
                where: { id: procedure === null || procedure === void 0 ? void 0 : procedure.id_field },
            });
            const data = { ...procedure, field };
            response.json({ success: true, data, message: "Thành công" });
        };
        this.addProcedure = async (request, response, next) => {
            const reqBody = request.body;
            // const thanh_phan_ho_so = reqBody.thanh_phan_ho_so;
            const thanh_phan_ho_so = reqBody.thanh_phan_ho_so.map((thanh_phan, index) => new docx_1.Paragraph({
                children: [
                    new docx_1.TextRun({
                        text: `${index + 1}. ${thanh_phan.toLowerCase()}............................................................................`,
                    }),
                ],
            }));
            // Create a new Document instance
            const doc = new docx_1.Document({
                sections: [
                    {
                        properties: {},
                        children: [
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                                        bold: true,
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.CENTER,
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "Độc lập - Tự do - Hạnh phúc",
                                        bold: true,
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.CENTER,
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "Quảng Ninh, ngày... tháng ... năm 202...",
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.RIGHT,
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `${reqBody.name}`,
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.CENTER,
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "-----------------------------------",
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.CENTER,
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Kính gửi: ${reqBody.ten_co_quan} `,
                                        bold: true,
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.CENTER,
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "",
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "- Tên cơ quan, tổ chức, đơn vị :.....................................................................",
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "- Địa chỉ:.......................................................... Số điện thoại:.......................",
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "- Số Fax/Email:..............................................................................................",
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "",
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "Xin phép tổ chức họp báo với các thông tin như sau:",
                                    }),
                                ],
                            }),
                            ...thanh_phan_ho_so,
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "",
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `${reqBody.note}`,
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "",
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "Người đứng đầu cơ quan, tổ chức, đơn vị",
                                        bold: true,
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.RIGHT,
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: "(ký, đóng dấu, ghi rõ họ tên)",
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.RIGHT,
                            }),
                        ],
                    },
                ],
            });
            // Save the generated document to a file
            const outputPath = "output.docx";
            docx_1.Packer.toBuffer(doc).then((buffer) => {
                fs.writeFileSync(outputPath, buffer);
                console.log("Document generated successfully!");
            });
            const procedure = await this.prisma.procedures.createMany({
                data: {
                    id: Math.floor(Math.random() * 1000),
                    key: reqBody.key,
                    id_field: Number.parseInt(reqBody.id_field),
                    name: reqBody.name,
                    thanh_phan_ho_so: "",
                    cach_thuc_thuc_hien: reqBody.cach_thuc_thuc_hien,
                    doi_tuong_thuc_hien: reqBody.doi_tuong_thuc_hien,
                    trinh_tu_thuc_hien: reqBody.trinh_tu_thuc_hien,
                    thoi_han_giai_quyet: reqBody.thoi_han_giai_quyet,
                    le_phi: reqBody.le_phi,
                    so_luong_ho_so: Number.parseInt(reqBody.so_luong_ho_so),
                    yeu_cau_dieu_kien: reqBody.yeu_cau_dieu_kien,
                    can_cu_phap_ly: reqBody.can_cu_phap_ly,
                    ket_qua_thuc_hien: reqBody.ket_qua_thuc_hien,
                    level: Number.parseInt(reqBody.level),
                },
            });
            const result = {
                data: procedure,
                success: false,
                message: "Thao tac thanh cong",
            };
            if (procedure) {
                response.json(result);
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.addProcedureOption = async (request, response, next) => {
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
                response.json({ success: true, message: "Thanh công" });
            }
        };
        this.getOptionByProcedureId = async (request, response, next) => {
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
            }
            else {
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
                }
                else {
                    next(new notFound_1.default());
                }
            }
        };
        this.getOptionByOptionId = async (request, response, next) => {
            const id_option = Number.parseInt(request.params.id_option);
            const option = await this.prisma.procedure_options.findUnique({
                where: { id: id_option },
            });
            const procedure = await this.prisma.procedures.findUnique({
                where: {
                    id: option === null || option === void 0 ? void 0 : option.id_procedure,
                },
            });
            response.json({ success: true, data: { ...option, procedure } });
        };
        this.addSteps = async (request, response, next) => {
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
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.getStepsByOptionId = async (request, response, next) => {
            const id_option = Number.parseInt(request.params.id_option);
            const steps = await this.prisma.procedure_steps.findMany({
                where: { id_option },
                orderBy: {
                    order: "asc",
                },
            });
            const data = await Promise.all(steps.map(async (step) => {
                const group = await this.prisma.groups.findUnique({
                    where: { id: step.id_group },
                });
                return { ...step, group };
            }));
            const result = {
                message: "Thao tác thành công",
                success: true,
                data,
            };
            if (result) {
                response.json(result);
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.getStepById = async (request, response, next) => {
            const id_step = Number.parseInt(request.params.id_step);
            const step = await this.prisma.procedure_steps.findUnique({
                where: { id: id_step },
            });
            const group = await this.prisma.groups.findUnique({
                where: { id: step === null || step === void 0 ? void 0 : step.id_group },
            });
            const option = await this.prisma.procedure_options.findFirst({
                where: {
                    id_procedure: step === null || step === void 0 ? void 0 : step.id_procedure,
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
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.editStepById = async (request, response, next) => {
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
            }
            else {
                response.json({ success: false });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllProcedures);
        this.router.get(this.path + "/get/:id", this.getProcedureById);
        this.router.post(this.path + "/add", this.addProcedure);
        this.router.post(this.path + "/options/add", this.addProcedureOption);
        this.router.get(this.path + "/options/get/:id_procedure", this.getOptionByProcedureId);
        this.router.get(this.path + "/option/get/:id_option", this.getOptionByOptionId);
        this.router.post(this.path + "/steps/add", this.addSteps);
        this.router.get(this.path + "/steps/get/:id_option", this.getStepsByOptionId);
        this.router.get(this.path + "/step/get/:id_step", this.getStepById);
        this.router.put(this.path + "/steps/edit", this.editStepById);
    }
}
exports.default = adminProcedureController;
