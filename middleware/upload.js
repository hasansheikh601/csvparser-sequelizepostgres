import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    console.log(file.originalname);
    const dir = "../assets/uploads";
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
  console.log("Reading file in middleware", file.originalname);
  console.log("file mimetype", file.mimetype);
  if (file == undefined) {
    cb("Please upload a file", false);
  } else if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload a CSV file", false);
  }
};

export default multer({
  storage: storage,
  fileFilter: csvFilter,
});
