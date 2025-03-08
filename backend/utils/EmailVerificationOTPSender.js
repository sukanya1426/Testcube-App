import dotenv from "dotenv";
dotenv.config();
import VerificationEmailModel from "../models/VerificationEmail.js";
import nodemailer from "nodemailer";

const sendEmailVerificationOTP = async (user) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await new VerificationEmailModel({
        userId: user._id,
        otp
    }).save();

    const otpVerificationLink = `${process.env.FRONTEND_HOST}/verify-email`;
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "spl2testcube@gmail.com",
                pass: "eccdiofgjfaqlucp",
            },
        });

        const mailOptions = {
            from: "spl2testcube@gmail.com",
            to: user.email,
            subject: "OTP for Email Verification",
            text: `
            Email Verification\n
            Dear User\n
            Thank you for registering in TestCube. Please use the following OTP and link to verify your email address:\n
            Link: ${otpVerificationLink}\n
            OTP: ${otp}\n
            This OTP is valid for 10 minutes.\n
            If you did not request this, please ignore this email.\n
            Best regards\n
            TestCube Team
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmailVerificationOTP;
