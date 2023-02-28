"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../exceptions/notFound"));
const base_1 = require("./abstractions/base");
class addressController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/address";
        this.getAllProvinces = async (request, response) => {
            const provinces = await this.prisma.province.findMany();
            response.json(provinces);
        };
        this.getDistrictByProvinceId = async (request, response, next) => {
            const province_id = Number.parseInt(request.params.id);
            const districts = await this.prisma.district.findMany({
                where: {
                    province_id,
                },
            });
            if (districts) {
                response.json(districts);
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.getWardByDistrictId = async (request, response, next) => {
            const district_id = Number.parseInt(request.params.id);
            const wards = await this.prisma.ward.findMany({
                where: {
                    district_id,
                },
            });
            if (wards) {
                response.json(wards);
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/province", this.getAllProvinces);
        this.router.get(this.path + "/district/:id", this.getDistrictByProvinceId);
        this.router.get(this.path + "/ward/:id", this.getWardByDistrictId);
    }
}
exports.default = addressController;
