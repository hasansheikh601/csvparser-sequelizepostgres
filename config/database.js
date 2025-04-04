import { Sequelize } from "sequelize";
// import config from "./config.json";
// import config from "./config.json" assert { type: "json" };
import path from "path";

import fs from "fs";
const rawConfig = fs.readFileSync(
  path.resolve("./config/config.json"),
  "utf-8"
);
const config = JSON.parse(rawConfig);

// const env = process.env.NODE_ENV || "development";
// const dbConfig = config[env];
const dbConfig = config.development; // Use the development configuration directly
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port || 5432, // Default port for PostgreSQL
    logging: dbConfig.logging || false, // Disable logging; default: console.log
    pool: {
      max: dbConfig.pool?.max || 5,
      min: dbConfig.pool?.min || 0,
      acquire: dbConfig.pool?.acquire || 30000,
      idle: dbConfig.pool?.idle || 10000,
    },
  }
);

export default sequelize;

// export default sequelize;
// const { Sequelize } = require("sequelize");
// const config = require("./config.json");

// const env = process.env.NODE_ENV || "development";
// const dbConfig = config[env];

// const sequelize = new Sequelize(
//   dbConfig.database,
//   dbConfig.username,
//   dbConfig.password,
//   {
//     host: dbConfig.host,
//     dialect: dbConfig.dialect,
//     port: dbConfig.port || 5432, // Default port for PostgreSQL
//     logging: dbConfig.logging || false, // Disable logging; default: console.log
//     pool: {
//       max: dbConfig.pool?.max || 5,
//       min: dbConfig.pool?.min || 0,
//       acquire: dbConfig.pool?.acquire || 30000,
//       idle: dbConfig.pool?.idle || 10000,
//     },
//   }
// );

// module.exports = sequelize;
