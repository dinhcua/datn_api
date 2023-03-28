"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
class adminFieldsController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/fields";
        this.getAllFields = async (request, response, next) => {
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
                const totalFields = await (await this.prisma.fields.findMany({ where })).length;
                const fields = await this.prisma.fields.findMany({
                    where,
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                const data = await Promise.all(fields.map(async (field) => {
                    const organization_field = await this.prisma.organization_field.findMany({
                        where: { id_field: field.id },
                    });
                    if (!organization_field.length)
                        return;
                    const organization = await this.prisma.organizations.findUnique({
                        where: { id: organization_field[0].id_organization },
                    });
                    return { ...field, organization };
                }));
                const fieldsLength = fields.length;
                const result = {
                    current_page: numPage,
                    data,
                    from: fieldsLength ? 1 : 0,
                    to: fieldsLength,
                    total: totalFields,
                    next_page_url: fields.length === numPerPage
                        ? `http://localhost:8000/api/admin/fields/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/admin/fields/get?page=${numPage - 1}&perPage=${numPerPage}`
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
                const data = await this.prisma.fields.findMany();
                // const fieldsLength = fields.length;
                const result = {
                    // current_page: numPage,
                    data,
                    success: true,
                    message: "Thao tác thành công",
                    // from: fieldsLength ? 1 : 0,
                    // to: fieldsLength,
                    // total: totalFields,
                    // next_page_url:
                    //   fields.length === numPerPage
                    //     ? `http://localhost:8000/api/admin/fields/get?page=${
                    //         numPage + 1
                    //       }&perPage=${numPerPage}`
                    //     : null,
                    // prev_page_url:
                    //   numPage > 1
                    //     ? `http://localhost:8000/api/admin/fields/get?page=${
                    //         numPage - 1
                    //       }&perPage=${numPerPage}`
                    //     : null,
                };
                if (result) {
                    response.json(result);
                }
                else {
                    next(new notFound_1.default());
                }
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllFields);
    }
}
exports.default = adminFieldsController;
