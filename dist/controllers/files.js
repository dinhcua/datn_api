"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./abstractions/base");
const notFound_1 = __importDefault(require("../exceptions/notFound"));
const utility_1 = require("../utility");
class FilesController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/files";
        this.search = async (request, response, next) => {
            const { page, perPage, key, identity_card } = request.query;
            if (typeof perPage === "string" && typeof page === "string") {
                const numPage = Number.parseInt(page);
                const numPerPage = Number.parseInt(perPage);
                const skip = (numPage - 1) * numPerPage;
                let files = [];
                if (typeof key === "string" && typeof identity_card === "string") {
                    if (key === "" && identity_card !== "") {
                        const user = await this.prisma.users.findFirst({
                            where: {
                                identity_card,
                            },
                        });
                        if (!user)
                            return;
                        files = await this.prisma.files.findMany({
                            where: {
                                id_user: user.id,
                            },
                            skip,
                            take: numPerPage,
                            orderBy: { id: "asc" },
                        });
                    }
                    else if (key !== "" && identity_card === "") {
                        files = await this.prisma.files.findMany({
                            where: {
                                key,
                            },
                            skip,
                            take: numPerPage,
                            orderBy: { id: "asc" },
                        });
                    }
                    else {
                        const user = await this.prisma.users.findFirst({
                            where: {
                                identity_card,
                            },
                        });
                        if (!user)
                            return;
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
                const filesAndProcedure = await Promise.all(files.map(async (file) => {
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
                }));
                const filesLength = files.length;
                const result = {
                    current_page: numPage,
                    data: filesAndProcedure,
                    from: filesLength ? 1 : 0,
                    to: filesLength,
                    total: totalFiles,
                    next_page_url: filesLength === numPerPage
                        ? `http://localhost:8000/api/files/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/files/get?page=${numPage - 1}&perPage=${numPerPage}`
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
        this.getFiles = async (request, response, next) => {
            const { page, perPage, id_user } = request.query;
            if (typeof page === "string" &&
                typeof perPage === "string" &&
                typeof id_user === "string") {
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
                const totalFiles = await (await this.prisma.files.findMany({ where: { id_user: numIdUser } })).length;
                const files = await this.prisma.files.findMany({
                    where: { id_user: numIdUser },
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                const filesAndProcedure = await Promise.all(files.map(async (file) => {
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
                }));
                const filesLength = files.length;
                const result = {
                    current_page: numPage,
                    data: filesAndProcedure,
                    from: filesLength ? 1 : 0,
                    to: filesLength,
                    total: totalFiles,
                    next_page_url: filesLength === numPerPage
                        ? `http://localhost:8000/api/procedures/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/procedures/get?page=${numPage - 1}&perPage=${numPerPage}`
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
        this.getFileById = async (request, response, next) => {
            const id_file = Number.parseInt(request.params.id);
            const file = await this.prisma.files.findUnique({
                where: {
                    id: id_file,
                },
            });
            const procedure = await this.prisma.procedures.findUnique({
                where: {
                    id: file === null || file === void 0 ? void 0 : file.id_procedure,
                },
            });
            const user_info = await this.prisma.info_user.findUnique({
                where: {
                    id: file === null || file === void 0 ? void 0 : file.id_info_user,
                },
            });
            if (file === null || file === void 0 ? void 0 : file.access_key) {
                const files = await this.prisma.file_storage.findMany({
                    where: { category: file.access_key },
                });
                const data = { ...file, procedure, user_info, files };
                response.json({ data });
            }
            else {
                const data = { ...file, procedure, user_info, files: [] };
                response.json({ data });
            }
        };
        this.getFileStepsById = async (request, response, next) => {
            const id_file = Number.parseInt(request.params.id);
            const file = await this.prisma.files.findUnique({ where: { id: id_file } });
            const id_procedure = file === null || file === void 0 ? void 0 : file.id_procedure;
            const procedure_option = await this.prisma.procedure_options.findFirst({
                where: { id_procedure: id_procedure },
            });
            const steps = await this.prisma.procedure_steps.findMany({
                where: {
                    id_option: procedure_option === null || procedure_option === void 0 ? void 0 : procedure_option.id,
                },
                orderBy: {
                    order: "asc",
                },
            });
            console.log("steps", steps);
            const stepsFinished = steps.slice(0, file === null || file === void 0 ? void 0 : file.current_step);
            const data = await Promise.all(stepsFinished.map(async (step) => {
                const user = await this.prisma.users.findFirst({
                    where: {
                        id_group: step.id_group,
                        // id_organization: step.id_group,
                    },
                });
                return { step: { ...step }, user };
            }));
            if (steps) {
                response.json({ data });
            }
        };
        this.submitFile = async (request, response, next) => {
            const key = (0, utility_1.generateShortKey)(6);
            const access_key = (0, utility_1.generateShortKey)(10);
            const reqBody = request.body;
            const option = reqBody.option.steps.find((step) => {
                return step.order === 1;
            });
            // const thanh_phan_ho_so = reqBody.procedure.thanh_phan_ho_so;
            const data_thanh_phan_ho_so = reqBody.file.thanh_phan_ho_so;
            const steps = await this.prisma.procedure_steps.findMany({
                where: { id_procedure: reqBody.file.id_procedure },
            });
            const current_step = steps.find((step) => step.order === 1);
            if (!current_step)
                return;
            const infoUser = await this.prisma.info_user.findFirst({
                where: {
                    id_user: reqBody.user.id,
                },
            });
            // console.log(infoUser);
            if (!infoUser)
                return;
            // console.log("reqBody", reqBody);
            // console.log("reqBody.procedure.id", reqBody.procedure.id);
            const file = await this.prisma.files.create({
                data: {
                    id_procedure: Number.parseInt(reqBody.procedure.id),
                    id_option: option.id_group,
                    id_user: reqBody.user.id,
                    id_step: option === null || option === void 0 ? void 0 : option.id,
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
            }
            else {
                response.json({
                    success: false,
                    message: "Nộp hồ sơ thất bại",
                });
            }
        };
        this.cancelFile = async (request, response, next) => {
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
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.search);
        this.router.get(this.path + "/get-files", this.getFiles);
        this.router.get(this.path + "/get/:id", this.getFileById);
        this.router.get(this.path + "/get-file-steps/:id", this.getFileStepsById);
        this.router.post(this.path + "/submit", this.submitFile);
        this.router.post(this.path + "/cancel", this.cancelFile);
    }
}
exports.default = FilesController;
