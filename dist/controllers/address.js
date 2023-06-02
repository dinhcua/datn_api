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
        this.getAddress = async (request, response, next) => {
            const ward_id = Number.parseInt(request.params.ward_id);
            const ward = await this.prisma.ward.findUnique({
                where: {
                    id: ward_id,
                },
            });
            const district = await this.prisma.district.findUnique({
                where: {
                    id: ward === null || ward === void 0 ? void 0 : ward.district_id,
                },
            });
            const wards = await this.prisma.ward.findMany({
                where: { district_id: district === null || district === void 0 ? void 0 : district.id },
            });
            // const provinces = await this.prisma.province.findMany({});
            const province = await this.prisma.province.findUnique({
                where: {
                    id: district === null || district === void 0 ? void 0 : district.province_id,
                },
            });
            const districts = await this.prisma.district.findMany({
                where: { province_id: province === null || province === void 0 ? void 0 : province.id },
            });
            const data = {
                ward: ward === null || ward === void 0 ? void 0 : ward.id,
                wards,
                district: district === null || district === void 0 ? void 0 : district.id,
                districts,
                province: province === null || province === void 0 ? void 0 : province.id,
            };
            response.json(data);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/province", this.getAllProvinces);
        this.router.get(this.path + "/district/:id", this.getDistrictByProvinceId);
        this.router.get(this.path + "/ward/:id", this.getWardByDistrictId);
        this.router.get(this.path + "/address/:ward_id", this.getAddress);
    }
}
exports.default = addressController;
