import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import csv from "fast-csv"; // Import fast-csv for CSV parsing
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

export default router;
