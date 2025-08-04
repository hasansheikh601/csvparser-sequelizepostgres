import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CsvData = sequelize.define(
  "CsvData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Generic fields that can store any CSV data
    data: {
      type: DataTypes.JSONB, // Store all CSV data as JSON
      allowNull: false,
    },
    // Metadata fields
    source_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total_records: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // You can add more specific fields based on your CSV structure
    // For example, if you know your CSV has specific columns:
    // name: { type: DataTypes.STRING },
    // email: { type: DataTypes.STRING },
    // age: { type: DataTypes.INTEGER },
  },
  {
    tableName: "csv_data",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default CsvData;
