import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Menu = sequelize.define("Menu", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
  day: DataTypes.STRING,
  mealSlot: DataTypes.STRING,
});

export default Menu;
