// routes/otpRoutes.js
import express from "express";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("📩 OTP request for:", email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove previous OTPs
    await Otp.deleteMany({ email });

    // Save OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send email
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("❌ Send OTP error:", error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    await Otp.deleteMany({ email });

    res.json({ message: "OTP verified" });
  } catch (error) {
    console.error("❌ Verify OTP error:", error.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

export default router;
