import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/practice");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadFile = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
      return cb(new Error("تنها مجاز به آپلود تصویر و پی دی اف می باشد"));
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 3 },
});

const upload =
  (file: any) => (req: Request, res: Response, next: NextFunction) => {
    uploadFile.single(file)(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            status: 400,
            message: "حجم فایل بیشتر از 3 مگابایت است",
          });
        }
        return res.status(500).json({
          status: 500,
          message: "خطایی رخ داده است",
        });
      }
      next();
    });
  };
export default upload;
