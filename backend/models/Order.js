// models/Order.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define("Order", {
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],     // ✅ IMPORTANT
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  user: DataTypes.STRING,
  paymentId: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

export default Order;
