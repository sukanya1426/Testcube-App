import express from 'express';
import UserController from '../controllers/UserController.js';
import upload from '../utils/fileUpload.js';


const router = express.Router();

router.post('/register', UserController.register);
router.post('/verify-email', UserController.verifyEmail);
router.post('/login', UserController.login);
// router.post(
//     "/upload",
//     upload.fields([
//       { name: "apkFile", maxCount: 1 },
//       { name: "txtFile", maxCount: 1 },
//     ]),
//     UserController.uploadFiles
//   );
  router.post("/upload", UserController.uploadFiles);
  

export default router;