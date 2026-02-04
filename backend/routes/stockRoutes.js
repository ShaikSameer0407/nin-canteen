import express from "express";
import {
  getStock,
  addStock,
  deleteStock,
} from "../controllers/stockController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* ANY LOGGED-IN USER */
router.get("/", auth(), getStock);

/* ADMIN ONLY */
router.post("/", auth("admin"), addStock);
router.delete("/:id", auth("admin"), deleteStock);

export default router;
