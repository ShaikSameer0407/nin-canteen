import express from "express";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/verify", auth(), (req, res) => {
  res.json({ success: true });
});

export default router;
