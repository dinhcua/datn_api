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
    this.router.get(this.path + "/address/:ward_id", this.getAddress);
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

  getAddress = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const ward_id = Number.parseInt(request.params.ward_id);

    const ward = await this.prisma.ward.findUnique({
      where: {
        id: ward_id,
      },
    });

    const district = await this.prisma.district.findUnique({
      where: {
        id: ward?.district_id,
      },
    });

    const wards = await this.prisma.ward.findMany({
      where: { district_id: district?.id },
    });

    // const provinces = await this.prisma.province.findMany({});
    const province = await this.prisma.province.findUnique({
      where: {
        id: district?.province_id,
      },
    });

    const districts = await this.prisma.district.findMany({
      where: { province_id: province?.id },
    });

    const data = {
      ward: ward?.id,
      wards,
      district: district?.id,
      districts,
      province: province?.id,
    };

    response.json(data);
  };
}
