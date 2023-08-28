"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const twilio_1 = __importDefault(require("twilio"));
const sendSMS = async (message) => {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = (0, twilio_1.default)(accountSid, authToken);
    try {
        // const numbers = await client.incomingPhoneNumbers.list();
        // console.log(numbers);
        // numbers.forEach((number) => {
        //   console.log("Phone Number:", number.phoneNumber);
        // });"Hồ sơ Đăng ký cấp phát lại bằng lái xe của công dân Lương Đình Của đã xử lý THÀNH CÔNG. Mã hồ sơ k4LFh5. CỔNG DỊCH VỤ CÔNG TRỰC TUYẾN - HUMG"
        const messageSMS = await client.messages.create({
            body: message,
            from: "+1 850 788 2146",
            to: "+84966944309", // Recipient's phone number
        });
        // console.log("SMS sent:", message.sid);
    }
    catch (error) {
        console.error("Error sending SMS:", error);
    }
};
exports.sendSMS = sendSMS;
