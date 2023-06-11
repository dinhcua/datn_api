"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
class adminGroupsController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/groups";
        this.getAllFields = async (request, response, next) => {
            const { page, perPage, q } = request.query;
            if (typeof page === "string" && typeof perPage === "string") {
                const numPage = Number.parseInt(page);
                const numPerPage = Number.parseInt(perPage);
                const skip = (numPage - 1) * numPerPage;
                const totalGroups = await (await this.prisma.groups.findMany()).length;
                const groups = await this.prisma.groups.findMany({
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                const data = await Promise.all(groups.map(async (field) => {
                    const organization = await this.prisma.organizations.findUnique({
                        where: { id: field.id_organization },
                    });
                    const users = await this.prisma.users.findMany({
                        where: {
                            role: 1,
                            organization: field.name,
                            id_group: field.id,
                        },
                    });
                    return { ...field, organization, users };
                }));
                const groupsLength = groups.length;
                const result = {
                    current_page: numPage,
                    data,
                    from: groupsLength ? 1 : 0,
                    to: groupsLength,
                    total: totalGroups,
                    next_page_url: groups.length === numPerPage
                        ? `http://localhost:8000/api/admin/groups/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/admin/groups/get?page=${numPage - 1}&perPage=${numPerPage}`
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
        this.getGroupById = async (request, response, next) => {
            const id = request.params.id;
            if (typeof id === "string") {
                const group_id = Number.parseInt(id);
                const group = await this.prisma.groups.findUnique({
                    where: { id: group_id },
                });
                const users = await this.prisma.users.findMany({
                    where: {
                        role: 1,
                        organization: group === null || group === void 0 ? void 0 : group.name,
                        id_organization: group_id,
                    },
                });
                if (group) {
                    return response.json({
                        data: { ...group, users },
                        success: true,
                        message: "Thao tác thành công",
                    });
                }
                else {
                    next(new notFound_1.default());
                }
            }
        };
        this.addGroup = async (request, response, next) => {
            const reqBody = request.body;
            const addGroup = await this.prisma.groups.create({
                data: {
                    id_organization: Number.parseInt(reqBody.id_organization),
                    name: reqBody.name,
                    note: reqBody.note,
                },
            });
            if (addGroup) {
                response.json({ success: "true", message: "Thanh cong" });
            }
        };
        this.editGroup = async (request, response, next) => {
            const reqBody = request.body;
            const group_id = Number.parseInt(reqBody.id);
            const updateGroup = await this.prisma.groups.update({
                where: {
                    id: group_id,
                },
                data: {
                    name: reqBody.name,
                    id_organization: Number.parseInt(reqBody.id_organization),
                    note: reqBody.note,
                },
            });
            const updateUser = await Promise.all(reqBody.users.map(async (id_user) => {
                await this.prisma.users.update({
                    where: {
                        id: Number.parseInt(id_user),
                    },
                    data: {
                        id_organization: Number.parseInt(reqBody.id),
                        organization: reqBody.name,
                    },
                });
            }));
            if (updateUser) {
                response.json({
                    success: true,
                    data: updateGroup,
                    message: "Sua thanh cong",
                });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllFields);
        this.router.get(this.path + "/get/:id", this.getGroupById);
        this.router.post(this.path + "/add", this.addGroup);
        this.router.put(this.path + "/edit", this.editGroup);
    }
}
exports.default = adminGroupsController;
