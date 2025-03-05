import express from 'express';
import UserController from '../controllers/UserController.js';
import passport from 'passport';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';


const router = express.Router();

router.post('/register', UserController.register);
router.post('/verify-email', UserController.verifyEmail);
router.post('/login', UserController.login);
router.post("/upload", UserController.uploadFiles);
router.post("/refresh", UserController.getNewAccessToken);



router.get("/profile", accessTokenAutoRefresh, passport.authenticate('jwt', {session: false}), UserController.getProfile);
router.get("/files", accessTokenAutoRefresh, passport.authenticate('jwt', {session: false}), UserController.getFiles);
router.post("/report", accessTokenAutoRefresh, passport.authenticate('jwt', {session: false}), UserController.getReport);
  

export default router;