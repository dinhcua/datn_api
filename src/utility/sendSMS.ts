import twilio from "twilio";

export const sendSMS = async (message: string) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;

  const client = twilio(accountSid, authToken);

  try {
    // const numbers = await client.incomingPhoneNumbers.list();
    // console.log(numbers);

    // numbers.forEach((number) => {
    //   console.log("Phone Number:", number.phoneNumber);
    // });"Hồ sơ Đăng ký cấp phát lại bằng lái xe của công dân Lương Đình Của đã xử lý THÀNH CÔNG. Mã hồ sơ k4LFh5. CỔNG DỊCH VỤ CÔNG TRỰC TUYẾN - HUMG"
    const messageSMS = await client.messages.create({
      body: message,
      from: "+1 850 788 2146", // Your Twilio phone number
      to: "+84966944309", // Recipient's phone number
    });
    // console.log("SMS sent:", message.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
