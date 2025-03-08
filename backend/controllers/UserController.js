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
import numberToWords from 'number-to-words';
import sendPasswordResetOtp from '../utils/PasswordResetEmail.js'
import {parseEmail} from '../utils/ParseEmail.js'



class UserController {

    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const subFolder = parseEmail(req.headers.email);
            let version = 1;

            // Determine whether the file is APK or TXT
            const fileTypeFolder = file.mimetype.startsWith('application/vnd.android.package-archive') ? 'apk' : 'txt';

            // Check if the version folder exists
            while (fs.existsSync(`uploads/${subFolder}/${fileTypeFolder}/${numberToWords.toWords(version)}`)) {
                version++;
            }

            // Construct the directory path based on the file type and version
            const versionFolder = numberToWords.toWords(version); // Folder like "one", "two"
            const fullPath = `uploads/${subFolder}/${fileTypeFolder}/${versionFolder}`;

            // Ensure directories exist
            if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
            if (!fs.existsSync(`uploads/${subFolder}`)) fs.mkdirSync(`uploads/${subFolder}`);
            if (!fs.existsSync(`uploads/${subFolder}/${fileTypeFolder}`)) fs.mkdirSync(`uploads/${subFolder}/${fileTypeFolder}`);
            if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);

            // Proceed to store the file in `fullPath`
            cb(null, fullPath);
        },

        filename: (req, file, cb) => {
            const subFolder = parseEmail(req.headers.email);
            let version = 1;

            // Determine whether the file is APK or TXT
            const fileTypeFolder = file.mimetype.startsWith('application/vnd.android.package-archive') ? 'apk' : 'txt';

            // Handle versioning logic
            while (fs.existsSync(`uploads/${subFolder}/${fileTypeFolder}/${numberToWords.toWords(version)}`)) {
                version++;
            }
            version--;

            const fileName = `${version}${file.originalname}`;
            if (file.originalname.endsWith(".apk")) {
                req.apkName = fileName;
            } else {
                req.txtName = fileName;
            }
            req.version = version;
            cb(null, fileName);

            // Return the filename for storage
            cb(null, fileName);
        }
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

            const apkLink = `/home/saimon/Documents/Testcube-App/backend/uploads/${parseEmail(email)}/apk/${numberToWords.toWords(version)}/${apkName}`;
            const txtLink = `/home/saimon/Documents/Testcube-App/backend/uploads/${parseEmail(email)}/txt/${numberToWords.toWords(version)}/${txtName}`;

            const apk = await new ApkModel({
                name: apkName,
                userId: user._id,
                version,
                apkLink,
                txtLink
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
                        link: apk.apkLink,
                        version: apk.version,
                        progress: apk.progress,
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


    static changePassword = async (req, res) => {
        const { email, password, confirmPassword } = req.body;
        console.log
        if (!email) {
            return res.status(400).json({ message: "Email field is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password field is required" });
        }
        if (!confirmPassword) {
            return res.status(400).json({ message: "Confirm password field is required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email doesn't exist" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        console.log(user)
        console.log(password)
        res.status(200).json({ message: "Password changed successfully" });
    }
}



export default UserController; 