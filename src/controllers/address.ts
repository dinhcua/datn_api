import express from "express";
import NotFoundException from "../exceptions/notFound";
import { BaseController } from "./abstractions/base";

export default class addressController extends BaseController {
  public path = "/api/address";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/province", this.getAllProvinces);
    this.router.get(this.path + "/district/:id", this.getDistrictByProvinceId);
    this.router.get(this.path + "/ward/:id", this.getWardByDistrictId);
  }
  getAllProvinces = async (
    request: express.Request,
    response: express.Response,
  ) => {
    const provinces = await this.prisma.province.findMany();
    response.json(provinces);
  };

  getDistrictByProvinceId = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const province_id = Number.parseInt(request.params.id);
    const districts = await this.prisma.district.findMany({
      where: {
        province_id,
      },
    });
    if (districts) {
      response.json(districts);
    } else {
      next(new NotFoundException());
    }
  };
  getWardByDistrictId = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const district_id = Number.parseInt(request.params.id);
    const wards = await this.prisma.ward.findMany({
      where: {
        district_id,
      },
    });

    if (wards) {
      response.json(wards);
    } else {
      next(new NotFoundException());
    }
  };
}
