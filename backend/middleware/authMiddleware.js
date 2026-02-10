// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = (role) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });
    if (role && user.role !== role) return res.status(403).json({ message: "Access denied" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
