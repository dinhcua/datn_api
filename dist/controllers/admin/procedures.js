"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
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
        this.addProcedure = async (request, response, next) => {
            const reqBody = request.body;
            const totalProcedures = await this.prisma.procedures.count();
            const procedure = await this.prisma.procedures.create({
                data: {
                    id: totalProcedures + 1,
                    ...reqBody,
                },
            });
            const result = {
                data: procedure,
                success: true,
                message: "Thao tac thanh cong",
            };
            if (result) {
                response.json(result);
            }
            else {
                next(new notFound_1.default());
            }
        };
        //   {
        //     "success": true,
        //     "data": {
        //         "id": 4,
        //         "id_procedure": 5,
        //         "id_template": 2,
        //         "name": "dinhcua11",
        //         "processing_time": 25,
        //         "created_at": "2023-03-28T03:07:38.000000Z",
        //         "updated_at": "2023-03-28T03:07:38.000000Z",
        //         "deleted_at": null,
        //         "procedure": {
        //             "id": 5,
        //             "key": "gầ",
        //             "id_field": 4,
        //             "name": "agdga",
        //             "thanh_phan_ho_so": [
        //                 null
        //             ],
        //             "cach_thuc_thuc_hien": null,
        //             "doi_tuong_thuc_hien": null,
        //             "trinh_tu_thuc_hien": null,
        //             "thoi_han_giai_quyet": null,
        //             "le_phi": null,
        //             "so_luong_ho_so": null,
        //             "yeu_cau_dieu_kien": null,
        //             "can_cu_phap_ly": null,
        //             "ket_qua_thuc_hien": null,
        //             "level": 2,
        //             "created_at": "2023-03-28T03:07:03.000000Z",
        //             "updated_at": "2023-03-28T03:07:03.000000Z",
        //             "deleted_at": null
        //         },
        //         "template": {
        //             "id": 2,
        //             "name": "Mặc định (Lý do nộp)",
        //             "data": "[{\"label\":\"Lý do\",\"name\":\"ly_do\",\"type\":\"textbox\"}]",
        //             "created_at": "2021-06-10T00:59:45.000000Z",
        //             "updated_at": "2021-06-10T00:59:45.000000Z",
        //             "deleted_at": null
        //         }
        //     },
        //     "message": "Thao tác thành công"
        // }
        this.getOption = async (request, response, next) => {
            const id_procedure = Number.parseInt(request.params.id);
            const option = await this.prisma.procedure_options.findFirst({
                where: { id_procedure },
            });
            const template = this.prisma.templates.findUnique({
                where: { id: option === null || option === void 0 ? void 0 : option.id_template },
            });
            const result = {
                message: "Thao tác thành công",
                success: true,
                data: {
                    ...option,
                    template,
                },
            };
            if (result) {
                response.json(result);
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.addSteps = async (request, response, next) => {
            const totalSteps = await this.prisma.procedure_steps.count();
            const reqBody = request.body;
            const order = await this.prisma.procedure_steps.findMany({
                where: { id_option: Number.parseInt(reqBody.id_option) },
            });
            const step = await this.prisma.procedure_steps.create({
                data: {
                    id: totalSteps + 1,
                    name: reqBody.name,
                    note: reqBody.note,
                    id_group: Number.parseInt(reqBody.id_group),
                    id_option: Number.parseInt(reqBody.id_option),
                    order: order.length + 1,
                },
            });
            const result = {
                message: "Thao tác thành công",
                success: true,
                data: step,
            };
            if (result) {
                response.json(result);
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.getSteps = async (request, response, next) => {
            const id_option = Number.parseInt(request.params.id_option);
            const steps = await this.prisma.procedure_steps.findMany({
                where: { id_option },
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
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllProcedures);
        this.router.post(this.path + "/add", this.addProcedure);
        this.router.get(this.path + "/options/get/:id", this.getOption);
        this.router.post(this.path + "/steps/add", this.addSteps);
        this.router.get(this.path + "/steps/get/:id_option", this.getSteps);
    }
}
exports.default = adminProcedureController;
