import express from "express";
import { createReadStream } from "fs";
import { parse } from "fast-csv";
import CsvData from "../models/csvData.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Upload CSV data
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a CSV file" });
    }

    const filePath = `./assets/uploads/${req.file.filename}`;
    const csvData = [];

    // Parse CSV file
    createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on("error", (error) => {
        console.error("CSV parsing error:", error);
        return res.status(500).json({ error: "Failed to parse CSV file" });
      })
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", async () => {
        try {
          // Store CSV data in database
          const csvRecord = await CsvData.create({
            data: csvData,
            source_file: req.file.originalname,
            total_records: csvData.length,
          });

          res.status(200).json({
            message: `CSV file "${req.file.originalname}" uploaded successfully`,
            data: {
              id: csvRecord.id,
              total_records: csvRecord.total_records,
              uploaded_at: csvRecord.uploaded_at,
            },
          });
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({ error: "Failed to store data in database" });
        }
      });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Get all CSV data records
router.get("/data", async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause = {
        source_file: {
          [CsvData.sequelize.Op.iLike]: `%${search}%`,
        },
      };
    }

    const csvRecords = await CsvData.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.json({
      data: csvRecords.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(csvRecords.count / limit),
        total_records: csvRecords.count,
        records_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get specific CSV data by ID
router.get("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const csvRecord = await CsvData.findByPk(id);

    if (!csvRecord) {
      return res.status(404).json({ error: "CSV data not found" });
    }

    res.json({
      data: csvRecord,
    });
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Query CSV data with filters
router.post("/query", async (req, res) => {
  try {
    const { csvId, filters, limit = 100 } = req.body;

    const csvRecord = await CsvData.findByPk(csvId);
    if (!csvRecord) {
      return res.status(404).json({ error: "CSV data not found" });
    }

    let data = csvRecord.data;

    // Apply filters if provided
    if (filters && Array.isArray(filters)) {
      data = data.filter((row) => {
        return filters.every((filter) => {
          const { field, operator, value } = filter;

          switch (operator) {
            case "equals":
              return row[field] === value;
            case "contains":
              return row[field]?.toLowerCase().includes(value.toLowerCase());
            case "greater_than":
              return parseFloat(row[field]) > parseFloat(value);
            case "less_than":
              return parseFloat(row[field]) < parseFloat(value);
            default:
              return true;
          }
        });
      });
    }

    // Apply limit
    data = data.slice(0, parseInt(limit));

    res.json({
      data: data,
      total_records: data.length,
      original_total: csvRecord.total_records,
    });
  } catch (error) {
    console.error("Error querying CSV data:", error);
    res.status(500).json({ error: "Failed to query data" });
  }
});

// Delete CSV data
router.delete("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const csvRecord = await CsvData.findByPk(id);

    if (!csvRecord) {
      return res.status(404).json({ error: "CSV data not found" });
    }

    await csvRecord.destroy();
    res.json({ message: "CSV data deleted successfully" });
  } catch (error) {
    console.error("Error deleting CSV data:", error);
    res.status(500).json({ error: "Failed to delete data" });
  }
});

export default router;
