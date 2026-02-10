import express from "express";
import multer from "multer";
import Menu from "../models/Menu.js";

const router = express.Router();
const upload = multer({ dest: "uploads" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description, day, mealSlot } = req.body;

    const menu = await Menu.create({
      name,
      price: Number(price),
      category,
      description,
      day,
      mealSlot,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(menu);
  } catch (e) {
    console.error("❌ Menu insert failed:", e);
    res.status(500).json({ message: e.message });
  }
});

router.get("/", async (req, res) => {
  const rows = await Menu.findAll({ order: [["createdAt", "DESC"]] });
  res.json(rows);
});

export default router;
