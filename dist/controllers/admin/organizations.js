"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
class adminOrganizationController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/organizations";
        this.getAllOrganizations = async (request, response, next) => {
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
                const totalOrganizations = await (await this.prisma.organizations.findMany({ where })).length;
                const organizations = await this.prisma.organizations.findMany({
                    where,
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                const organizationsLength = organizations.length;
                const result = {
                    current_page: numPage,
                    data: organizations,
                    from: organizationsLength ? 1 : 0,
                    to: organizationsLength,
                    total: totalOrganizations,
                    next_page_url: organizations.length === numPerPage
                        ? `http://localhost:8000/api/admin/organizations/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/admin/organizations/get?page=${numPage - 1}&perPage=${numPerPage}`
                        : null,
                };
                if (result) {
                    response.json(result);
                }
                else {
                    next(new notFound_1.default());
                }
            }
            else {
                const organizations = await this.prisma.organizations.findMany();
                if (organizations) {
                    response.json({
                        success: true,
                        data: organizations,
                        message: "Thao tác thành công",
                    });
                }
                else {
                    next(new notFound_1.default());
                }
            }
        };
        this.getOrganizationById = async (request, response, next) => {
            const organization_id = Number.parseInt(request.params.id);
            const organization = await this.prisma.organizations.findUnique({
                where: {
                    id: organization_id,
                },
            });
            if (organization) {
                response.json({
                    success: true,
                    data: organization,
                    message: "Thao tác thành công",
                });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllOrganizations);
        this.router.get(this.path + "/get/:id", this.getOrganizationById);
    }
}
exports.default = adminOrganizationController;
