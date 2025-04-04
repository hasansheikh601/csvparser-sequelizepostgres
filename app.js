import express from "express";
import sequelize from "./config/database.js"; // Import sequelize instance
// import routes from './routes/index.js';
import empCsvCtrl from "./controllers/empCsvCtrl.js";

const app = express();
const PORT = process.env.PORT || 7979;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes(app);
app.use("/api/csv", empCsvCtrl);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();

export default app; // Export app for testing purposes
