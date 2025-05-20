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

// import express from "express";
// import sequelize from "./config/database.js";
// import empCsvCtrl from "./controllers/empCsvCtrl.js";
// import cluster from "cluster";
// import os from "os";

// const numCpus = os.cpus().length;
// const PORT = process.env.PORT || 7979;

// const createServer = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log(`Worker ${process.pid} connected to DB successfully.`);

//     const app = express();

//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     app.use("/api/csv", empCsvCtrl);

//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT} by worker ${process.pid}`);
//     });
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);
//   for (let i = 0; i < numCpus; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork(); // optional: respawn the worker
//   });
// } else {
//   createServer(); // Only workers run the server
// }
