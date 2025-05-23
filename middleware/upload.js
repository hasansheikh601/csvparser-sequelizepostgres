// import fs from "fs";
// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (_req, file, cb) => {
//     console.log(file.originalname);
//     const dir = "../assets/uploads";
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null);
//   },
//   filename: (_req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const csvFilter = (_req, file, cb) => {
//   console.log("Reading file in middleware", file.originalname);
//   console.log("file mimetype", file.mimetype);
//   if (file == undefined) {
//     cb("Please upload a file", false);
//   } else if (file.mimetype.includes("csv")) {
//     cb(null, true);
//   } else {
//     cb("Please upload a CSV file", false);
//   }
// };

// export default multer({
//   storage: storage,
//   fileFilter: csvFilter,
// });

import fs from "fs";
import multer from "multer";
import path from "path";

// Get absolute path to `assets/uploads`
const uploadPath = path.resolve("assets/uploads");

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // ✅ Fixed this line
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const csvFilter = (_req, file, cb) => {
  console.log("Reading file in middleware", file.originalname);
  console.log("file mimetype", file.mimetype);
  if (!file) {
    cb(new Error("Please upload a file"), false);
  } else if (
    file.mimetype === "text/csv" ||
    file.originalname.endsWith(".csv")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

export default multer({
  storage: storage,
  fileFilter: csvFilter,
});
