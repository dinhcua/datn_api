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
            const { page, perPage, q, organization_id } = request.query;
            if (typeof page === "string" && typeof perPage === "string") {
                const numPage = Number.parseInt(page);
                const numPerPage = Number.parseInt(perPage);
                let searchText;
                searchText =
                    typeof q === "string"
                        ? {
                            OR: [{ name: { contains: q } }, { key: { contains: q } }],
                        }
                        : {};
                if (typeof organization_id === "string") {
                    const allOrFields = await this.prisma.organization_field.findMany({
                        where: {
                            id_organization: Number.parseInt(organization_id),
                        },
                    });
                    searchText =
                        typeof q === "string"
                            ? {
                                OR: [{ name: { contains: q } }, { key: { contains: q } }],
                                id: { in: allOrFields.map((orField) => orField.id_field) },
                            }
                            : { id: { in: allOrFields.map((orField) => orField.id_field) } };
                }
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
                    const organization_field = await this.prisma.organization_field.findFirst({
                        where: { id_field: field.id },
                    });
                    if (!organization_field)
                        return { ...field, organization: {} };
                    const organization = await this.prisma.organizations.findUnique({
                        where: { id: organization_field.id_organization },
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
        this.getFieldById = async (request, response, next) => {
            const field_id = Number.parseInt(request.params.id);
            const field = await this.prisma.fields.findUnique({
                where: {
                    id: field_id,
                },
            });
            const organization_field = await this.prisma.organization_field.findFirst({
                where: {
                    id_field: field_id,
                },
            });
            const organization = await this.prisma.organizations.findUnique({
                where: {
                    id: organization_field === null || organization_field === void 0 ? void 0 : organization_field.id_organization,
                },
            });
            const data = {
                ...field,
                organization,
            };
            if (data) {
                response.json({
                    success: true,
                    data: data,
                    message: "Thao tác thành công",
                });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.editFieldById = async (request, response, next) => {
            const reqBody = request.body;
            const field_id = Number.parseInt(reqBody.id);
            const editFieldData = {
                id: field_id,
                key: reqBody.key,
                name: reqBody.name,
                description: reqBody.name,
            };
            const updateField = await this.prisma.fields.update({
                where: {
                    id: field_id,
                },
                data: {
                    ...editFieldData,
                },
            });
            if (!updateField) {
                next(new notFound_1.default());
            }
            const updateOrgField = await this.prisma.organization_field.updateMany({
                where: {
                    id_field: field_id,
                },
                data: {
                    id_organization: reqBody.organizations[0],
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
        this.addField = async (request, response, next) => {
            const reqBody = request.body;
            const addField = await this.prisma.fields.create({
                data: {
                    key: reqBody.key,
                    name: reqBody.name,
                },
            });
            const addOrgField = await Promise.all(reqBody.organizations.map((id_organization) => this.prisma.organization_field.create({
                data: {
                    id_organization: Number.parseInt(id_organization),
                    id_field: addField.id,
                },
            })));
            if (addOrgField) {
                response.json({ success: true, message: "Thanh cong" });
            }
        };
        this.deleteFieldById = async (request, response, next) => {
            const { force_delete } = request.query;
            const reqBody = request.body;
            const field_id = Number.parseInt(request.params.id);
            // if (force_delete === "0") {
            //   //is_force_delete
            //   try {
            //     const fieldData = await this.prisma.fields.findUnique({
            //       where: { id: field_id },
            //     });
            //     await this.prisma.trash.create({
            //       data: {
            //         id: totalTrashElement + 1,
            //         data: JSON.stringify(fieldData),
            //         name: "fields",
            //       },
            //     });
            //     // await this.prisma.fields.delete({ where: { id: field_id } });
            //     response.json({
            //       success: true,
            //       message: "Thao tác thành công",
            //     });
            //   } catch (e) {
            //     next(new NotFoundException());
            //   }
            // }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllFields);
        this.router.get(this.path + "/get/:id", this.getFieldById);
        this.router.put(this.path + "/edit", this.editFieldById);
        this.router.post(this.path + "/add", this.addField);
        this.router.delete(this.path + "/delete/:id", this.deleteFieldById);
    }
}
exports.default = adminFieldsController;
