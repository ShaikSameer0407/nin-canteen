// models/Stock.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Stock = sequelize.define("Stock", {
  itemName: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
});

export default Stock;
