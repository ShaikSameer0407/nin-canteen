import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Menu from "../models/Menu.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= CREATE MENU ================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const menu = await Menu.create({
      name,
      price,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET MENU ================= */
router.get("/", async (req, res) => {
  const menu = await Menu.find();
  res.json(menu);
});

/* ================= DELETE MENU (FIXED) ================= */
router.delete("/:id", async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    /* DELETE IMAGE FILE */
    if (item.image) {
      const imagePath = path.join(process.cwd(), item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Menu.findByIdAndDelete(req.params.id);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
