import express from "express";
import NotFoundException from "../../exceptions/notFound";
import { BaseController } from "../abstractions/base";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
export default class adminAuthController extends BaseController {
  public path = "/api/admin/auth";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path + "/login", this.login);
    this.router.post(this.path + "/register", this.register);
  }

  login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { email, password } = request.body;

    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user && user.role !== 0 && process.env.JWT_SECRET) {
      const isMatch = await bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return response.status(401).json({ message: "Invalid credentials" });
      }
      const payload = { user: { id: user.id } };
      const generateToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "36000",
      });

      const token = {
        access_token: generateToken,
        expires_in: "36000",
        token_type: "bearer",
      };

      response.json({ data: { user, token } });
    } else {
      next(new NotFoundException());
    }
  };

  register = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const reqBody = request.body;

    const checkValidEmail = await this.prisma.users.findFirst({
      where: {
        email: reqBody.email,
      },
    });

    if (checkValidEmail) {
      console.log("Email đã tồn tại");

      response.json({ success: false, message: "Email đã tồn tại" });
      return;
    }

    const checkValidPhoneNumber = await this.prisma.users.findFirst({
      where: {
        phone_number: reqBody.phone_number,
      },
    });
    if (checkValidPhoneNumber) {
      console.log("Số điện thoại đã tồn tại");

      response.json({ success: false, message: "Số điện thoại đã tồn tại" });
      return;
    }

    const checkIdentityCard = await this.prisma.users.findFirst({
      where: {
        identity_card: reqBody.identity_card,
      },
    });
    if (checkIdentityCard) {
      console.log("Số CCCD/CMT đã tồn tại");

      response.json({ success: false, message: "Số CCCD/CMT đã tồn tại" });
      return;
    }
    if (
      !checkIdentityCard &&
      !checkValidEmail &&
      !checkValidPhoneNumber &&
      process.env.JWT_SECRET &&
      process.env.SALT_ROUNDS
    ) {
      const province = (await this.prisma.province.findUnique({
        where: {
          id: +reqBody.province,
        },
      })) || { name: "" };

      const district = (await this.prisma.district.findUnique({
        where: {
          id: +reqBody.district,
        },
      })) || { name: "" };

      const ward = (await this.prisma.ward.findUnique({
        where: {
          id: +reqBody.ward,
        },
      })) || { name: "" };
      const hashPassword = bcrypt.hashSync(
        reqBody.password,
        Number.parseInt(process.env.SALT_ROUNDS),
      );
      console.log(hashPassword);
      const address =
        ward?.name + ", " + district?.name + ", " + province?.name;
      const user = await this.prisma.users.create({
        data: {
          password: hashPassword,
          email: reqBody.email,
          full_name: reqBody.full_name,
          organization: reqBody.organization,
          date_of_birth: new Date(reqBody.date_of_birth),
          identity_card: reqBody.identity_card,
          identity_card_date: new Date(reqBody.identity_card_date),
          identity_card_address: reqBody.identity_card_address,
          phone_number: reqBody.phone_number,
          fax: reqBody.fax,
          website: reqBody.website,
          ward: reqBody.ward,
          address,
        },
      });

      const payload = { user: { id: user.id } };
      const generateToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "36000",
      });

      const token = {
        access_token: generateToken,
        expires_in: "36000",
        token_type: "bearer",
      };

      response.json({ data: { user, token } });
    } else {
      next(new NotFoundException());
    }
  };
}
