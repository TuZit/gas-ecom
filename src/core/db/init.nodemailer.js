import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "email-smtp.ap-southeast-1.amazonaws.com",
  port: 456,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "AKIA4SW7WGZBCLIDGPGC",
    pass: "BK9T1lDhe+6nBtD27dpJSAM+gTTL+vJ2imrVS+0qfLYk",
  },
});

export { transporter };
