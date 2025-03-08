import express from 'express';
import UserController from '../controllers/UserController.js';
import AuthenticationProvider from '../controllers/AuthController.js';
import passport from 'passport';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';


const router = express.Router();

router.post('/register', AuthenticationProvider.sign_up);
router.post('/verify-email', AuthenticationProvider.verifyEmail);
router.post('/login', AuthenticationProvider.log_in);
router.post("/upload", UserController.uploadFiles);
router.post("/refresh", UserController.getNewAccessToken);
router.post("/logout", AuthenticationProvider.sign_out);
router.post("/reset-password", AuthenticationProvider.sendResetPasswordEmail);
router.post("/verify-password-reset-otp", AuthenticationProvider.verifyPasswordResetOtp);
router.post("/change-password", AuthenticationProvider.changePassword);



router.get("/profile", accessTokenAutoRefresh, passport.authenticate('jwt', {session: false}), UserController.getProfile);
router.get("/files", accessTokenAutoRefresh, passport.authenticate('jwt', {session: false}), UserController.getFiles);
router.post("/report", accessTokenAutoRefresh, passport.authenticate('jwt', {session: false}), UserController.getReport);
  

export default router;