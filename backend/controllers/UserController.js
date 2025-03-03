import InputValidator from '../utils/InputValidator.js';
import UserModel from '../models/User.js';
import sendEmailVerificationOTP from '../utils/EmailVerificationOTPSender.js';
import bcrypt from 'bcrypt';
import VerificationEmailModel from '../models/VerificationEmail.js';
import generateAccessToken from '../utils/GenerateAccessToken.js';
import setTokenCookies from '../utils/SetTokenCookies.js';
import upload from "../utils/fileUpload.js";
import fs from "fs";
import multer from 'multer';


class UserController {
    static register = async (req, res) => {
        try {
            const { email, password, confirmPassword } = req.body;

            const { message, isValid } = InputValidator.isValidInfo(email, password, confirmPassword);

            if (!isValid) {
                return res.status(400).json({
                    message: message
                })
            }

            const existingUser = await UserModel.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    message: "This email is associated with another account."
                })
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await new UserModel({
                email,
                password: hashedPassword
            }).save();

            await sendEmailVerificationOTP(newUser);

            return res.status(201).json({
                message: "User created successfully.",
                user: {
                    id: newUser._id,
                    email: newUser.email
                }
            })


        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error. Please try again."
            })
        }
    }

    static verifyEmail = async (req, res) => {
        try {
            const { email, otp } = req.body;

            const { message, isValid } = InputValidator.isValidEmail(email);

            if (!isValid) {
                return res.status(400).json({
                    message: message
                })
            }

            if (!otp) {
                return res.status(400).json({
                    message: "OTP is required."
                })
            }

            const existingUser = await UserModel.findOne({ email });

            if (!existingUser) {
                return res.status(404).json({
                    message: "Email doesn't exists."
                })
            }

            if (existingUser.is_verified) {
                return res.status(400).json({
                    message: "Email is already verified."
                })
            }

            const verificationEmail = await VerificationEmailModel.findOne({ userId: existingUser._id, otp });

            if (!verificationEmail) {
                if (!existingUser.is_verified) {
                    await sendEmailVerificationOTP(existingUser);
                    return res.status(400).json({
                        message: "Invalid OTP. New OTP sent to your email."
                    })
                }
                return res.status(400).json({
                    message: "Invalid OTP."
                })
            }

            const currentTime = new Date();
            const expirationTime = new Date(verificationEmail.createdAt.getTime() + 10 * 60 * 1000);

            if (currentTime > expirationTime) {
                await sendEmailVerificationOTP(existingUser);
                return res.status(400).json({
                    message: "OTP expired. New OTP sent to your email."
                })
            }

            existingUser.is_verified = true;
            await existingUser.save();
            await VerificationEmailModel.deleteOne({ userId: existingUser._id });
            return res.status(200).json({
                message: "Email verified successfully."
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error. Please try again."
            })
        }
    }

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const { message, isValid } = InputValidator.isValidEmail(email, password);

            if (!isValid) {
                return res.status(400).json({
                    message: message
                })
            }

            if (!password) {
                return res.status(400).json({
                    message: "Password is required."
                })
            }

            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: "Invalid email or password."
                })
            }

            if (!user.is_verified) {
                return res.status(400).json({
                    message: "Email is not verified."
                })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(404).json({
                    message: "Invalid email or password."
                })
            }

            const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateAccessToken(user);

            setTokenCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

            res.status(200).json({
                user: {
                    id: user._id,
                    email: user.email
                },
                message: "Login successful.",
                access_token: accessToken,
                refresh_token: refreshToken,
                access_token_exp: accessTokenExp,
                is_authenticated: true,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error. Please try again."
            })
        }
    }

    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/"); // Save files in the 'uploads' folder
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
        },
    });

    static upload = multer({ storage: this.storage }).fields([
        { name: "apkFile", maxCount: 1 },
        { name: "txtFile", maxCount: 1 },
    ]);

    static uploadFiles = async (req, res) => {
        this.upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            if (!req.files || !req.files.apkFile || !req.files.txtFile) {
                return res.status(400).json({ message: "Both APK and TXT files are required!" });
            }

            console.log("Uploaded Files:", req.files);
            res.json({ message: "Files uploaded successfully!", files: req.files });
        });
        // try {
        //   if (!req.files || req.files.length === 0) {
        //     return res.status(400).json({ message: "No files uploaded." });
        //   }


        //   const apkFile = req.files["apkFile"] ? req.files["apkFile"][0] : null;
        //   const txtFile = req.files["txtFile"] ? req.files["txtFile"][0] : null;

        //   if (!apkFile || !txtFile) {

        //     if (apkFile) fs.unlinkSync(apkFile.path);
        //     if (txtFile) fs.unlinkSync(txtFile.path);
        //     return res.status(400).json({ message: "Both APK and TXT files must be uploaded." });
        //   }

        //   return res.status(200).json({
        //     message: "Files uploaded successfully.",
        //     files: {
        //       apk: { filename: apkFile.filename, path: apkFile.path },
        //       txt: { filename: txtFile.filename, path: txtFile.path },
        //     },
        //   });
        // } catch (err) {
        //   console.error(err);
        //   return res.status(500).json({ message: "Internal server error. Please try again." });
        // }
    };
}


export default UserController; 