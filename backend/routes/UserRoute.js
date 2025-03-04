import express from 'express';
import UserController from '../controllers/UserController.js';


const router = express.Router();

router.post('/register', UserController.register);
router.post('/verify-email', UserController.verifyEmail);
router.post('/login', UserController.login);
router.post("/upload", UserController.uploadFiles);
  

export default router;