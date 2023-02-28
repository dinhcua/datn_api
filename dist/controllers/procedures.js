"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./abstractions/base");
class proceduresController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/procedures";
        this.getAllProcedures = async (request, response, next) => {
            const { page, perPage, organization, search } = request.query;
            let organization_fields = [];
            if (typeof page === "string" && typeof perPage === "string") {
                const numPage = Number.parseInt(page);
                const numPerPage = Number.parseInt(perPage);
                if (typeof organization === "string") {
                    organization_fields = await this.prisma.organization_field.findMany({
                        where: { id_organization: Number.parseInt(organization) },
                    });
                }
                const searchText = typeof search === "string"
                    ? {
                        OR: [
                            { name: { contains: search } },
                            { key: { contains: search } },
                        ],
                    }
                    : {};
                const skip = (numPage - 1) * numPerPage;
                const where = organization_fields.length > 0
                    ? Object.keys(searchText).length
                        ? {
                            id_field: {
                                in: organization_fields.map((field) => field.id_field),
                            },
                            searchText,
                        }
                        : {
                            id_field: {
                                in: organization_fields.map((field) => field.id_field),
                            },
                        }
                    : Object.keys(searchText).length > 0
                        ? searchText
                        : {};
                const totalProcedures = await (await this.prisma.procedures.findMany({ where })).length;
                const procedures = await this.prisma.procedures.findMany({
                    where,
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                const proceduresAndField = await Promise.all(procedures.map(async (procedure) => {
                    const field = await this.prisma.fields.findUnique({
                        where: { id: procedure.id_field },
                    });
                    return {
                        ...procedure,
                        field,
                    };
                }));
                const proceduresLength = procedures.length;
                const result = {
                    current_page: numPage,
                    data: proceduresAndField,
                    from: proceduresLength ? 1 : 0,
                    to: proceduresLength,
                    total: totalProcedures,
                    next_page_url: procedures.length === numPerPage
                        ? `http://localhost:8000/api/procedures/get?page=${numPage + 1}&perPage=10`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/procedures/get?page=${numPage - 1}&perPage=10`
                        : null,
                };
                response.json(result);
            }
        };
        this.getProcedureById = async (request, response, next) => { };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllProcedures);
        this.router.get(this.path + "/get/:id", this.getProcedureById);
    }
}
exports.default = proceduresController;
