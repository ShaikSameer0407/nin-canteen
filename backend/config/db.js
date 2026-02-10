import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: console.log, // keep ON until things work
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected");
  } catch (e) {
    console.error("❌ DB connection failed:", e.message);
    process.exit(1);
  }
};

export default sequelize;
