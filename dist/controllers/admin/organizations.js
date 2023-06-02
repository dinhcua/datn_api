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
            const organization_field = await this.prisma.organization_field.findFirst({
                where: {
                    id_organization: organization_id,
                },
            });
            const fields = await this.prisma.fields.findMany({
                where: { id: organization_field === null || organization_field === void 0 ? void 0 : organization_field.id_field },
            });
            const data = {
                ...organization,
                fields,
            };
            if (organization) {
                response.json({
                    success: true,
                    data,
                    message: "Thao tác thành công",
                });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.getGroupFields = async (request, response, next) => {
            const organizations = await this.prisma.organizations.findMany({});
            const data = await Promise.all(organizations.map(async (organization) => {
                const organizationsFields = await this.prisma.organization_field.findMany({
                    where: { id_organization: organization.id },
                });
                const fields = await Promise.all(organizationsFields.map(async (field) => {
                    const data = await this.prisma.fields.findUnique({
                        where: { id: field.id_field },
                    });
                    if (data) {
                        const procedures = await this.prisma.procedures.findMany({
                            where: { id_field: field.id_field },
                        });
                        return {
                            ...data,
                            count_procedures: procedures.length,
                            pivot: {
                                id_organization: organization.id,
                                id_field: field.id_field,
                            },
                        };
                    }
                }));
                return {
                    ...organization,
                    fields,
                };
            }));
            if (data) {
                response.json({ success: true, data, message: "Thao tác thành công" });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.getGroups = async (request, response, next) => {
            const organizations = await this.prisma.organizations.findMany();
            const result = await Promise.all(organizations.map(async (organization) => {
                const groups = await this.prisma.groups.findMany({
                    where: { id_organization: organization.id },
                });
                return { ...organization, groups };
            }));
            if (result) {
                response.json({
                    success: true,
                    data: result,
                    message: "Thao tác thành công",
                });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.editOrganizationById = async (request, response, next) => {
            const reqBody = request.body;
            const organization_id = Number.parseInt(reqBody.id);
            const editOrganizationData = {
                id: organization_id,
                key: reqBody.key,
                name: reqBody.name,
            };
            const updateOrganization = await this.prisma.organizations.update({
                where: {
                    id: organization_id,
                },
                data: {
                    ...editOrganizationData,
                },
            });
            if (!updateOrganization) {
                next(new notFound_1.default());
            }
            const updateOrgField = await this.prisma.organization_field.updateMany({
                where: {
                    id_organization: organization_id,
                },
                data: {
                    id_field: reqBody.fields[0],
                },
            });
            if (updateOrgField) {
                response.json({
                    success: true,
                    message: "Thao tác thành công",
                });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.updateOrganization = async (request, response, next) => {
            const reqBody = request.body;
            const addOrganizations = await this.prisma.organizations.create({
                data: {
                    key: reqBody.key,
                    name: reqBody.name,
                },
            });
            if (addOrganizations) {
                response.json({ success: "true", message: "Thanh cong" });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllOrganizations);
        this.router.get(this.path + "/get/:id", this.getOrganizationById);
        this.router.get(this.path + "/get-group-fields", this.getGroupFields);
        this.router.get(this.path + "/get-groups", this.getGroups);
        this.router.put(this.path + "/edit", this.editOrganizationById);
        this.router.post(this.path + "/add", this.updateOrganization);
    }
}
exports.default = adminOrganizationController;
