import { randomInt } from "crypto";
import { newOTP } from "./oytp.service";
import templateModel from "../models/email/template.model.js";
import { getTemplate } from "./template.service.js";
import { transporter } from "../core/db/init.nodemailer.js";

async function sendEmailToken({ email = null }) {
  try {
    // 1. get token
    const token = await newOTP({ email });

    // 2. get Template
    const template = await getTemplate({
      tem_name: "HTML EMAIL TOKEN",
    });

    // 3. send email
    sendEmailLinkVerify({
      html,
      toEmail: email,
      subject: "Vui lòng xác nhận địa chỉ email để đăng ký vào shopDev",
    });
  } catch (error) {
    console.error(error);
  }
}

async function sendEmailLinkVerify({
  html,
  toEmail,
  subject = "Xác nhận Email đăng ký",
  text = "Xác nhận...",
}) {
  try {
    const mailOptions = {
      from: "papadracula141@gmail.com",
      to: toEmail,
      subject: subject,
      text: text,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
    return error;
  }
}
