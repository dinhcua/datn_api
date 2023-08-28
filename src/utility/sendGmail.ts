import nodemailer from "nodemailer";
import { google } from "googleapis";

export const sendGmail = async (message: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.ClIENT_ID,
    process.env.ClIENT_SECRET,
    process.env.REDIRECT_URI,
  );

  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  try {
    // Gửi email
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "luongdinhcua2512@gmail.com",
        clientId: process.env.ClIENT_ID as string,
        clientSecret: process.env.ClIENT_SECRET as string,
        refreshToken: process.env.REFRESH_TOKEN as string,
        accessToken: accessToken as string,
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
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
