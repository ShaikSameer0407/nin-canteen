import express from "express";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET ALL USERS (ADMIN) ================= */
router.get("/", auth("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE USER (ADMIN) ================= */
router.delete("/:id", auth("admin"), async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
