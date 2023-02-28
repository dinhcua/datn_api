"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../exceptions/notFound"));
const base_1 = require("./abstractions/base");
class fieldsController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/fields";
        this.getFields = async (request, response, next) => {
            const { organization } = request.query;
            if (typeof organization === "string") {
                const organization_fields = await this.prisma.organization_field.findMany({
                    where: { id_organization: Number.parseInt(organization) },
                });
                const data = await Promise.all(organization_fields.map(async (orgField) => {
                    return await this.prisma.fields.findUnique({
                        where: { id: orgField.id_field },
                    });
                }));
                if (data) {
                    response.json({
                        success: true,
                        data,
                        message: "Thao tác thành công",
                    });
                }
                else {
                    next(new notFound_1.default());
                }
            }
            //
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getFields);
    }
}
exports.default = fieldsController;
