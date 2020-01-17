import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';
import { config } from 'dotenv';
import path from 'path';

config();

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `<Naijatours Team ${process.env.EMAIL_ADRESS}>`;
  }

  //create transporter
  createNewTransport() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    //render HTML based on pug template
    const mailPath = path.join(__dirname, '../views/email');
    console.log(mailPath);
    const html = pug.renderFile(`${mailPath}/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    //Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.fromString(html),
      html
    };

    //Create transport and send mail
    await this.createNewTransport().sendMail(mailOptions);
  }

  async sendWelcomeMail() {
    await this.send('welcome', 'Welcome to Naijatours');
  }

  async sendPasswordResetMail() {
    await this.send('password-reset', 'Reset Password (valid for 30 minutes)');
  }
}
