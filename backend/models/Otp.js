// models/Otp.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Otp = sequelize.define("Otp", {
  email: DataTypes.STRING,
  otp: DataTypes.STRING,
  expiresAt: DataTypes.DATE,
});

export default Otp;
