"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../abstractions/base");
class adminFilesController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/files";
        this.getAllFiles = async (request, response, next) => {
            const files = await this.prisma.files.findMany({});
            const data = await Promise.all(files.map(async (file) => {
                const user_info = await this.prisma.info_user.findUnique({
                    where: {
                        id: file.id_info_user,
                    },
                });
                const step = await this.prisma.procedure_steps.findFirst({
                    where: {
                        id_group: 1,
                    },
                });
                return { ...file, user_info, step };
            }));
            response.json({ data });
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
        this.handleNextStep = async (request, response, next) => {
            const reqBody = request.body;
            const id_file = Number.parseInt(reqBody.id_file);
            const current_file = await this.prisma.files.findUnique({
                where: {
                    id: id_file,
                },
            });
            if (!(current_file === null || current_file === void 0 ? void 0 : current_file.id_step))
                return;
            //example
            // const totalProcedureSteps = await this.prisma.procedure_steps.findMany({
            //   where: {
            //     id_procedure : file.id_procedure
            //   },
            // });
            const totalProcedureSteps = 3;
            const current_step = current_file === null || current_file === void 0 ? void 0 : current_file.id_step;
            const isFinish = current_step === totalProcedureSteps;
            const file = await this.prisma.files.update({
                where: {
                    id: id_file,
                },
                data: {
                    id_step: (current_file === null || current_file === void 0 ? void 0 : current_file.id_step) + 1,
                    status: isFinish ? 2 : 1,
                },
            });
            if (file) {
                response.json({ success: true });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllFiles);
        this.router.get(this.path + "/get/:id", this.getFileById);
        this.router.post(this.path + "/next-step", this.handleNextStep);
    }
}
exports.default = adminFilesController;
