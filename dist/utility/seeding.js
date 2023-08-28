"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeding = void 0;
const twilio_1 = __importDefault(require("twilio"));
const seeding = async () => {
    // const oauth2Client = new google.auth.OAuth2(
    //   process.env.ClIENT_ID,
    //   process.env.ClIENT_SECRET,
    //   process.env.REDIRECT_URI,
    // );
    // oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    // try {
    //   // Gửi email
    //   const accessToken = await oauth2Client.getAccessToken();
    //   const transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //       type: "OAuth2",
    //       user: "luongdinhcua2512@gmail.com",
    //       clientId: process.env.ClIENT_ID as string,
    //       clientSecret: process.env.ClIENT_SECRET as string,
    //       refreshToken: process.env.REFRESH_TOKEN as string,
    //       accessToken: accessToken as string
    //     },
    //   });
    //   const mailOptions = {
    //     from: "luongdinhcua2512@gmail.com",
    //     to: "ldcua2512@gmail.com",
    //     subject: "Test Email",
    //     text: "Hello, this is a test email sent from Nodemailer with TypeScript!",
    //   };
    //   const info = await transporter.sendMail(mailOptions);
    //   console.log("Email sent:", info.response);
    // } catch (error) {
    //   console.error("Error sending email:", error);
    // }
    // await seedingUser();
    // await seedingAddress();
    // await seedingOrganField();
    // await seedingProcedure();
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = (0, twilio_1.default)(accountSid, authToken);
    try {
        const numbers = await client.incomingPhoneNumbers.list();
        // console.log(numbers);
        // numbers.forEach((number) => {
        //   console.log("Phone Number:", number.phoneNumber);
        // });
        const message = await client.messages.create({
            body: "Hồ sơ Đăng ký cấp phát lại bằng lái xe của công dân Lương Đình Của đã xử lý THÀNH CÔNG. Mã hồ sơ k4LFh5. CỔNG DỊCH VỤ CÔNG TRỰC TUYẾN - HUMG",
            from: "+1 850 788 2146",
            to: "+84966944309", // Recipient's phone number
        });
        console.log("SMS sent:", message.sid);
    }
    catch (error) {
        console.error("Error sending SMS:", error);
    }
};
exports.seeding = seeding;
