"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
class adminUserController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/";
        this.getAllFields = async (request, response, next) => {
            const { page, perPage, f } = request.query;
            if (typeof page === "string" && typeof perPage === "string") {
                const numPage = Number.parseInt(page);
                const numPerPage = Number.parseInt(perPage);
                const skip = (numPage - 1) * numPerPage;
                const where = {};
                const totalFields = await (await this.prisma.users.findMany({ where })).length;
                let users = await this.prisma.users.findMany({
                    where,
                    skip,
                    take: numPerPage,
                    orderBy: { id: "asc" },
                });
                let fieldsLength = users.length;
                if (typeof f === "string") {
                    const query = JSON.parse(f);
                    users = (query === null || query === void 0 ? void 0 : query.role)
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
                    next_page_url: users.length === numPerPage
                        ? `http://localhost:8000/api/admin/users/get?page=${numPage + 1}&perPage=${numPerPage}`
                        : null,
                    prev_page_url: numPage > 1
                        ? `http://localhost:8000/api/admin/users/get?page=${numPage - 1}&perPage=${numPerPage}`
                        : null,
                };
                if (result) {
                    response.json(result);
                }
                else {
                    next(new notFound_1.default());
                }
            }
            else if (typeof f === "string") {
                const query = JSON.parse(f);
                const role = Number.parseInt(query.role);
                if (typeof role === "number") {
                    const users = await this.prisma.users.findMany({
                        where: { role },
                    });
                    response.json({ data: users });
                }
                else {
                    response.json({ data: [] });
                }
            }
        };
        this.getUserById = async (request, response, next) => {
            const user_id = Number.parseInt(request.params.id);
            const user = await this.prisma.users.findUnique({ where: { id: user_id } });
            if (user) {
                response.json({
                    data: user,
                    success: true,
                    message: "Thao tác thành công",
                });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.getUserGroups = async (request, response, next) => {
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
        this.register = async (request, response, next) => {
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
            if (!checkIdentityCard &&
                !checkValidEmail &&
                !checkValidPhoneNumber &&
                process.env.JWT_SECRET &&
                process.env.SALT_ROUNDS) {
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
                const hashPassword = bcrypt_1.default.hashSync(reqBody.password, Number.parseInt(process.env.SALT_ROUNDS));
                const address = (ward === null || ward === void 0 ? void 0 : ward.name) + ", " + (district === null || district === void 0 ? void 0 : district.name) + ", " + (province === null || province === void 0 ? void 0 : province.name);
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
                const generateToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
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
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "users/get", this.getAllFields);
        this.router.get(this.path + "users/groups/:id_user", this.getUserGroups);
        this.router.get(this.path + "users/get/:id", this.getUserById);
        this.router.post(this.path + "users/add", this.register);
    }
}
exports.default = adminUserController;
