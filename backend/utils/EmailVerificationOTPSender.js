import dotenv from "dotenv";
dotenv.config();
import VerificationEmailModel from "../models/VerificationEmail.js";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";



const sendEmailVerificationOTP = async (user) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await new VerificationEmailModel({
        userId: user._id,
        otp
    }).save();

    const otpVerificationLink = `${process.env.FRONTEND_HOST}/verify-email`;

    const mailerSend = new MailerSend({
        apiKey: process.env.MAIL_API_KEY,
    });

    const sentFrom = new Sender("MS_FHmjPl@trial-z86org8p7d1lew13.mlsender.net");

    const recipients = [
        new Recipient(user.email)
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("OTP for Email Verification")
        .setHtml(
            `
            <h1>Email Verification</h1>
            <p>Dear ${user.name},</p>
            <p>Thank you for registering in TestCube. Please use the following OTP and link to verify your email address:</p>
            <p>Link: ${otpVerificationLink}</p>
            <h2>OTP: ${otp}</h2>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,</p>
            <p>TestCube Team</p>
        `
        );

    await mailerSend.email.send(emailParams);

    return otp;
};

export default sendEmailVerificationOTP;