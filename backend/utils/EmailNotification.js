import nodemailer from "nodemailer";

const sendReportNotification = async (userEmail, apkName) => {
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
            to: userEmail,
            subject: "Test Case Generation Completed",
            text: `Hello,\n\nYour test case for APK "${apkName}" has been successfully generated.Thank you for using our service\n\nRegards,\nTestCube`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendReportNotification;
