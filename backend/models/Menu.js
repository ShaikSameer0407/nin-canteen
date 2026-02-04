import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,

    image: {
      type: String,
      default: "",
    },

    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
