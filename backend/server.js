import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import sequelize, { connectDB } from "./config/db.js";

// 🔴 IMPORTANT: import ALL models before sync
import "./models/User.js";
import "./models/Menu.js";
import "./models/Order.js";
import "./models/Otp.js";
import "./models/Stock.js";
import "./models/Report.js";

import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const start = async () => {
  await connectDB();

  await sequelize.sync({ alter: false }); // 👈 creates tables
  console.log("📦 Tables synced:", Object.keys(sequelize.models));

  app.use("/api/auth", authRoutes);
  app.use("/api/menu", menuRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/otp", otpRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/counter", counterRoutes);

  app.get("/", (_, res) => res.send("🚀 API running"));

  app.listen(5000, () => console.log("🚀 Server on 5000"));
};

start();
