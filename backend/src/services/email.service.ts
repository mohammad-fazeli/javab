import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

class email {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  // TODO: change jwt secret
  sendVerificationEmail(email: string, cb: (err: any, info: any) => void) {
    const token = jwt.sign({ email }, process.env.EMAIL_SECRET as string, {
      expiresIn: "1h",
    });
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS as string,
      to: email,
      subject: "Confirm email",
      html: `
      <div style="text-align: center; font-size: 20px;">
      <h1 style="font-size: 40px;">تایید ایمیل</h1>
      <p>برای تایید حساب کاربری خود در جواب لینک زیر را دنبال کنید.</p>
      <a href="${process.env.URL}/verify/${token}">Confirm email</a>
      <p>اگر نمی خواهید در جواب ثبت نام کنید این ایمیل را نادیده بگیرید</p>
      </div>
      `,
    };
    this.transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, info);
      }
    });
  }
  verifyVerificationEmail(token: string, cb: (err: any, decoded: any) => void) {
    jwt.verify(
      token,
      process.env.EMAIL_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, decoded);
        }
      }
    );
  }
  // TODO: change jwt secret
  sendForgotPasswordEmail(email: string, cb: (err: any, info: any) => void) {
    const token = jwt.sign(
      { email },
      process.env.FORGET_PASSWORD_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS as string,
      to: email,
      subject: "Reset password",
      html: `
      <div style="text-align: center; font-size: 20px;">
      <h1 style="font-size: 40px;">بازیابی رمز عبور</h1>
      <p>برای تغییر رمز عبور خود در جواب لینک زیر را دنبال کنید.</p>
      <a href="${process.env.URL}/reset-password/${token}">Reset password</a>
      </div>
      `,
    };
    this.transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, info);
      }
    });
  }
  verifyForgotPassword(token: string, cb: (err: any, decoded: any) => void) {
    jwt.verify(
      token,
      process.env.FORGET_PASSWORD_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, decoded);
        }
      }
    );
  }
}

export default new email();
