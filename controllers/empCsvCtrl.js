import express from "express";
import path from "path";
import fs, { createReadStream } from "fs";
import { fileURLToPath } from "url";
import csv, { parse } from "fast-csv"; // Import fast-csv for CSV parsing
import Employee from "../models/employee.js";
import upload from "../middleware/upload.js";
import sendEmail from "../utils/sendEmail.js";
// import { emailQueue } from "../bullmq/queue.js";
const router = express.Router();

router.get("/getcsv", async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadDir = path.join(__dirname, "../assets/");
  console.log("__dirname", __dirname);
  try {
    console.log("this is test");

    // const filePath = path.join(__dirname, "../assets/testcsv.csv");
    // const filePath = "../assets/testcsv.csv";
    // console.log("File path:", filePath);
    const filePath = path.join(uploadDir, "customers-100.csv"); // Adjust filename if needed
    const jsonData = [];
    console.log("File path:", filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => jsonData.push(row))
      .on("end", () => res.json(jsonData))
      .on("error", (error) => res.status(500).json({ error: error.message }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("Req file", req.file);
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a file");
    }

    let employees = [];
    let path = "./assets/uploads/" + req.file.filename;
    createReadStream(path)
      .pipe(parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        employees.push(row);
      })
      .on("end", () => {
        Employee.bulkCreate(employees)
          .then(() => {
            res.status(200).send({
              message:
                "The file " +
                req.file.originalname +
                "has been uploaded successfully",
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Couldn't import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log("Error uploading file", error);
    res.status.send({
      message: "Failed to upload file: " + req.file.originalname,
    });
  }
});

// const upload = async (req, res) => {
//   try {
//     if (req.file == undefined) {
//       return res.status(400).send("Please upload a file");
//     }

//     let employees = [];
//     let path = "./assets/uploads/" + req.file.originalname;
//     createReadStream(path)
//       .pipe(parse({ headers: true }))
//       .on("error", (error) => {
//         throw error.message;
//       })
//       .on("data", (row) => {
//         employees.push(row);
//       })
//       .on("end", () => {
//         Employee.bulkCreate(employees)
//           .then(() => {
//             res.status(200).send({
//               message:
//                 "The file" +
//                 req.file.originalname +
//                 "has been uploaded successfully",
//             });
//           })
//           .catch((error) => {
//             res.status(500).send({
//               message: "Couldn't import data into database!",
//               error: error.message,
//             });
//           });
//       });
//   } catch (error) {
//     console.log("Error uploading file", error);
//     res.status.send({
//       message: "Failed to upload file: " + req.file.originalname,
//     });
//   }
// };

router.post("/createEmp", async (req, res) => {
  console.log("Req ", req.body);

  try {
    const emp = await Employee.create(req.body);
    console.log("Employee created:", emp);
    res.status(201).json(emp);
  } catch (error) {
    console.log("Error creating employee:", error);
  }
});

// router.post("/sendEmail", async (req, res) => {
//   // const { email } = req.body;
//   const mails = ["sheikh1@mailinator.com", "atif", "ismailawan@gmail.com"];
//   try {
//     //const data = req.body;
//     const testBody = `Hi. This Link is valid till 10 minutes
//     from now. <a href='https://koyal.pk'>Click Here</a>`;
//     const data = {
//       // to: email,
//       text: "This is a test email",
//       subject: "please ignore",
//       html: testBody,
//     };

//     const results = [];
//     // await Promise.all(mails.map((email) => sendEmail({ ...data, to: email }))); methos 1

//     for (const email of mails) {
//       try {
//         await sendEmail({ ...data, to: email });
//         results.push({ email: email, message: "success" });
//       } catch (error) {
//         results.push({ email: email, message: "failed" });
//         console.error("Error sending email:", error);
//       }
//     }
//     res.status(207).json({
//       message: "Bulk email process completed",
//       results,
//     });

//     // res.status(200).json({ message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ error: "Failed to send email" });
//   }
// });

router.post("/sendEmail", async (req, res) => {
  const mails = [
    "faisal@mailinator.com",
    "basit@gmail.com",
    "rimsha@gmail.com",
  ];

  const testBody = `Hi. This link is valid for 10 minutes.
  <a href='https://koyal.pk'>Click Here</a>`;

  try {
    for (const email of mails) {
      await emailQueue.add("sendEmail", {
        to: email,
        subject: "please ignore",
        text: "This is a test email",
        html: testBody,
      });
    }
    res.status(201).json({ message: "Emails queued successfully" });
  } catch (error) {
    console.error("Queuing failed", error);
    res.status(500).json({ error: "Failed to queue emails" });
  }
});

router.get("/heavy", (req, res) => {
  const start = Date.now();

  while (Date.now() - start < 5000) {
    // Simulate heavy computation
  }
  res.json({
    message: "load test",
    pid: process.pid,
    timeStamp: new Date().toISOString(),
  });
});

router.get("/ping", (req, res) => {
  res.json({
    message: "pong",
    pid: process.pid,
    timestamp: new Date().toISOString(),
  });
});

export default router;
