"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
class adminUserController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/";
        this.getAllFields = async (request, response, next) => {
            const { page, perPage, f } = request.query;
            if (typeof page === "string" && typeof perPage === "string") {
                const numPage = Number.parseInt(page);
                const numPerPage = Number.parseInt(perPage);
                const skip = (numPage - 1) * numPerPage;
                const where = {};
                const totalFields = await (await this.prisma.users.findMany({ where })).length;
                const users = await this.prisma.users.findMany({
                    where,
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                const fieldsLength = users.length;
                const result = {
                    current_page: numPage,
                    data: users,
                    from: fieldsLength ? 1 : 0,
                    to: fieldsLength,
                    total: totalFields,
                    next_page_url: users.length === numPerPage
                        ? `http://localhost:8000/api/admin/users/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/admin/users/get?page=${numPage - 1}&perPage=${numPerPage}`
                        : null,
                };
                if (result) {
                    response.json(result);
                }
                else {
                    next(new notFound_1.default());
                }
            }
            if (typeof f === "string") {
                const query = JSON.parse(f);
                const users = await this.prisma.users.findMany({ where: query });
                if (users.length) {
                    response.json({
                        data: users,
                        success: true,
                        message: "Thao tác thành công",
                    });
                }
                else {
                    next(new notFound_1.default());
                }
            }
        };
        this.getUserGroups = async (request, response, next) => {
            // const groups = await this.prisma.groups.findMany({});
            response.json({ data: [] });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "users/get", this.getAllFields);
        this.router.get(this.path + "user/groups", this.getUserGroups);
    }
}
exports.default = adminUserController;
