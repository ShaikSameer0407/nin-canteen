import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: Array,
  totalAmount: Number,
  user: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
