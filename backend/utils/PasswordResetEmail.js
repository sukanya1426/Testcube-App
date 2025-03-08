import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const sendPasswordResetOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpVerificationLink = `${process.env.FRONTEND_HOST}/forgot-password/otp`;
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
            to: email,
            subject: "OTP for Email Verification",
            text: `
            Email Verification\n
            Dear User\n
            Thank you for registering in TestCube. Please use the following OTP and link to verify your email address and change the password:\n
            Link: ${otpVerificationLink}\n
            OTP: ${otp}\n
            This OTP is valid for 10 minutes.\n
            If you did not request this, please ignore this email.\n
            Best regards\n
            TestCube Team
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
        return otp;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendPasswordResetOtp;
