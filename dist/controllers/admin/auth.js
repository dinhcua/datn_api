"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../exceptions/notFound"));
const base_1 = require("../abstractions/base");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class adminAuthController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/auth";
        this.login = async (request, response, next) => {
            const { email, password } = request.body;
            const user = await this.prisma.users.findUnique({
                where: {
                    email,
                },
            });
            if (user && user.role !== 0 && process.env.JWT_SECRET) {
                const isMatch = await bcrypt_1.default.compareSync(password, user.password);
                if (!isMatch) {
                    return response.status(401).json({ message: "Invalid credentials" });
                }
                const payload = { user: { id: user.id } };
                const generateToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "36000",
                });
                const token = {
                    access_token: generateToken,
                    expires_in: "36000",
                    token_type: "bearer",
                };
                response.json({ data: { user, token } });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.register = async (request, response, next) => {
            const reqBody = request.body;
            const checkInit = await this.prisma.users.findMany({
                where: {
                    OR: [
                        { email: reqBody.email },
                        { phone_number: reqBody.phone_number },
                        { identity_card: reqBody.identity_card },
                    ],
                },
            });
            if (!checkInit.length &&
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
                console.log(hashPassword);
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
                response.json({ data: { user, token } });
            }
            else {
                next(new notFound_1.default());
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + "/login", this.login);
        this.router.post(this.path + "/register", this.register);
    }
}
exports.default = adminAuthController;
