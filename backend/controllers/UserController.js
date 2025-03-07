import InputValidator from '../utils/InputValidator.js';
import UserModel from '../models/User.js';
import sendEmailVerificationOTP from '../utils/EmailVerificationOTPSender.js';
import bcrypt from 'bcrypt';
import VerificationEmailModel from '../models/VerificationEmail.js';
import generateAccessToken from '../utils/GenerateAccessToken.js';
import setTokenCookies from '../utils/SetTokenCookies.js';
import fs from "fs";
import multer from 'multer';
import ApkModel from '../models/Apk.js';
import io from 'socket.io-client'
import refreshAccessToken from '../utils/RefreshAccessToken.js';
import verifyRefreshToken from '../utils/VerifyRefreshToken.js';
import TestCaseModel from '../models/TestCase.js'
import RefreshTokenModel from '../models/RefreshToken.js';



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

    static logout = async (req, res) => {
        try {

            const refreshToken = req.cookies.refreshToken;
            await RefreshTokenModel.findOneAndUpdate(
              { token: refreshToken },
            );
            
            res.clearCookie('accessToken');    
            res.clearCookie('refreshToken');   
            res.clearCookie('is_authenticated'); 
    
            return res.status(200).json({
                message: "Logout successful."
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error. Please try again."
            });
        }
    }
    

    static parseEmail = (email) => {
        const prefix = email.split('@')[0];
        return prefix;
    }

    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const subFolder = this.parseEmail(req.headers.email);
            cb(null, "uploads/" + subFolder);
        },
        filename: (req, file, cb) => {
            const prefix = this.parseEmail(req.headers.email);
            let fileName = `1${prefix}-${file.originalname}`;

            if (!fs.existsSync("uploads/" + prefix)) {
                fs.mkdirSync("uploads/" + prefix);
            }

            let version = 1;

            while (fs.existsSync(`uploads/${prefix}/${fileName}`)) {
                version++;
                fileName = `${version}${prefix}-${file.originalname}`;
            }

            if (file.originalname.endsWith(".apk")) {
                req.apkName = fileName;
            } else {
                req.txtName = fileName;
            }
            req.version = version;
            cb(null, fileName);
        },
    });

    static upload = multer({ storage: this.storage }).fields([
        { name: "apkFile", maxCount: 1 },
        { name: "txtFile", maxCount: 1 },
    ]);

    static uploadFiles = async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                this.upload(req, res, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });

            if (!req.files) {
                return res.status(400).json({ message: "No files uploaded." });
            }

            if (!req.files.apkFile) {
                return res.status(400).json({ message: "APK file is required." });
            }

            if (!req.files.txtFile) {
                return res.status(400).json({ message: "TXT file is required." });
            }

            const { apkName, txtName, version } = req;
            const { email } = req.headers;

            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            const apkLink = `uploads/${this.parseEmail(email)}/${apkName}`;

            const apk = await new ApkModel({
                name: apkName,
                userId: user._id,
                version,
                apkLink,
            });

            await apk.save();

            this.startDroidbot(user._id, apk._id);

            return res.json({ message: "Files uploaded successfully!" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error. Please try again."
            })
        }
    };

    static startDroidbot = async (userId, apkId) => {
        const socket = io.connect("http://localhost:4000");

        console.log("Starting Droidbot...");

        socket.emit("start_droidbot", { userId, apkId });
    }

    static getNewAccessToken = async (req, res) => {
        try {
            const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res)

            setTokenCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp)

            res.status(200).send({
                message: "New tokens generated",
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                access_token_exp: newAccessTokenExp
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Unable to generate new token, please try again later" });
        }
    }

    static getProfile = async (req, res) => {
        res.send({ "user": req.user })
    }

    static getFiles = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const { tokenDetails, error } = await verifyRefreshToken(refreshToken);
            const apks = await ApkModel.find({ userId: tokenDetails._id });
            const data = {
                totalApks: apks.length,
                pending: apks.filter(apk => apk.isFinished === false).length,
                completed: apks.filter(apk => apk.isFinished === true).length,
                apks: apks.map(apk => {
                    return {
                        id: apk._id,
                        name: apk.name,
                    }
                })
            };
            return res.status(200).json({ message: "Files fetched successfully!", data });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error. Please try again."
            })
        }
    }

    static getReport = async (req, res) => {
        try {
            const { apkId, userId } = req.body;
            console.log(req.body);
            const testCases = await TestCaseModel.find({ userId, apkId });
            return res.status(200).json({ message: "Report fetched successfully!", testCases });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error. Please try again."
            })
        }
    }
}



export default UserController; 