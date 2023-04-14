import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class mailManager {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });
  }

  send = async (user, subject, text) => {
    const result = await this.transport.sendMail({
        from: process.env.MAIL_USER,
        to: user,
        subject,
        text,
    });
    return result;
  };
}

const sendMail = new mailManager();

export default sendMail;