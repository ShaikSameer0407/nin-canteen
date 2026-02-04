import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
