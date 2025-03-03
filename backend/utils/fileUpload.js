import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/vnd.android.package-archive", "text/plain"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only APK and TXT files are allowed!"), false);
  }
};


const upload = multer({
  storage,
  fileFilter,
});

export default upload;
