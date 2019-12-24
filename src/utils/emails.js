import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const sendMail = async options => {
  //CREATE TRANSPORTER
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //CREATE EMAIL OPTIONS
  const mailOptions = {
    from: 'Naijatours Team <coderlong.io@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  //SEND MAIL
  await transporter.sendMail(mailOptions);
};

export default sendMail;
