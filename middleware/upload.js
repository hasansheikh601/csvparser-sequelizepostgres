import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    console.log(file.originalname);
    const dir = "";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null);
  },
  filename: (_req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const csvFilter = (_req, file, cb) => {
  console.log("");
};
