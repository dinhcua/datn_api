"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const sendGmail = async (message) => {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.ClIENT_ID, process.env.ClIENT_SECRET, process.env.REDIRECT_URI);
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    try {
        // Gửi email
        const accessToken = await oauth2Client.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                type: "OAuth2",
                user: "luongdinhcua2512@gmail.com",
                clientId: process.env.ClIENT_ID,
                clientSecret: process.env.ClIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: "luongdinhcua2512@gmail.com",
            to: "ldcua2512@gmail.com",
            subject: "Cổng dịch vụ công trực tuyến",
            text: message,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
exports.sendGmail = sendGmail;
