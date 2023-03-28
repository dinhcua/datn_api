"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../exceptions/notFound"));
const base_1 = require("./abstractions/base");
class organizationController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/organizations";
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
        this.getAllOrganizations = async (request, response, next) => {
            const organizations = await this.prisma.organizations.findMany({});
            response.json({
                success: true,
                data: organizations,
                message: "Thao tác thành công",
            });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get-group-fields", this.getGroupFields);
        this.router.get(this.path + "/get", this.getAllOrganizations);
    }
}
exports.default = organizationController;
