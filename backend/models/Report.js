// models/Report.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Report = sequelize.define("Report", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
});

export default Report;
