import nodemailer from "nodemailer";
import "dotenv/config";

const { UKRNET_PASSWORD, UKRNET_EMAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKRNET_EMAIL,
    pass: UKRNET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const data = {
  to: "olexamelnik@gmail.com",
  subject: "Test email",
  html: "<strong>Test email</strong>",
};

const sendEmail = async (data) => {
  const email = { ...data, from: UKRNET_EMAIL };
  await transport.sendMail(email);
  return true;
};

export default sendEmail;
