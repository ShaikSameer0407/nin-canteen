// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not found in environment variables");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"NIN Canteen" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:3px">${otp}</h1>
        <p>Valid for <b>5 minutes</b></p>
      `,
    });

    console.log("✅ OTP email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
