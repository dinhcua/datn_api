import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import NotFoundException from "../../exceptions/notFound";
import { BaseController } from "../abstractions/base";
export default class adminUserController extends BaseController {
  public path = "/api/admin/";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "users/get", this.getAllFields);
    this.router.get(this.path + "users/groups/:id_user", this.getUserGroups);
    this.router.get(this.path + "users/get/:id", this.getUserById);
    this.router.post(this.path + "users/add", this.register);
  }

  getAllFields = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { page, perPage, f } = request.query;

    if (typeof page === "string" && typeof perPage === "string") {
      const numPage = Number.parseInt(page);
      const numPerPage = Number.parseInt(perPage);

      const skip = (numPage - 1) * numPerPage;
      const where = {};

      const totalFields = await (
        await this.prisma.users.findMany({ where })
      ).length;

      let users = await this.prisma.users.findMany({
        where,
        skip,
        take: numPerPage,
        orderBy: { id: "asc" },
      });

      let fieldsLength = users.length;

      if (typeof f === "string") {
        const query = JSON.parse(f);
        users = query?.role
          ? users.filter((user) => user.role === Number.parseInt(query.role))
          : users;

        fieldsLength = users.length;
      }

      const result = {
        current_page: numPage,
        data: users,
        from: fieldsLength ? 1 : 0,
        to: fieldsLength,
        total: totalFields,
        next_page_url:
          users.length === numPerPage
            ? `http://localhost:8000/api/admin/users/get?page=${
                numPage + 1
              }&perPage=${numPerPage}`
            : null,
        prev_page_url:
          numPage > 1
            ? `http://localhost:8000/api/admin/users/get?page=${
                numPage - 1
              }&perPage=${numPerPage}`
            : null,
      };
      if (result) {
        response.json(result);
      } else {
        next(new NotFoundException());
      }
    } else if (typeof f === "string") {
      const query = JSON.parse(f);

      const role = Number.parseInt(query.role);

      if (typeof role === "number") {
        const users = await this.prisma.users.findMany({
          where: { role },
        });
        response.json({ data: users });
      } else {
        response.json({ data: [] });
      }
    }
  };

  getUserById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const user_id = Number.parseInt(request.params.id);

    const user = await this.prisma.users.findUnique({ where: { id: user_id } });

    if (user) {
      response.json({
        data: user,
        success: true,
        message: "Thao tác thành công",
      });
    } else {
      next(new NotFoundException());
    }
  };

  getUserGroups = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id_user = request.params.id_user;

    const groups = await this.prisma.groups.findMany({
      where: {
        note: { contains: id_user },
      },
      orderBy: {
        id: "asc",
      },
    });

    response.json({ data: groups });
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
          role: reqBody.role,
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

      const info_user = await this.prisma.info_user.create({
        data: {
          id_user: user.id,
          email: reqBody.email,
          full_name: reqBody.full_name,
          organization: reqBody.organization,
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

      const result = {
        data: { user, token },
        success: true,
        message: "Thêm tài khoản thành công",
      };

      response.json(result);
    } else {
      next(new NotFoundException());
    }
  };
}
