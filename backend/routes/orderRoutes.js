import express from "express";
import Order from "../models/Order.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth(), async (req, res) => {
  res.json(await Order.create(req.body));
});

router.get("/", auth("admin"), async (_, res) => {
  res.json(await Order.find());
});

router.post("/", auth(), async (req, res) => {
  res.json(await Order.create(req.body));
});


router.get("/stats", auth("admin"), async (_, res) => {
  const orders = await Order.find();
  res.json({
    totalOrders: orders.length,
    totalRevenue: orders.reduce((a, b) => a + b.totalAmount, 0),
    totalSales: orders.reduce((a, b) => a + b.items.length, 0),
  });
});

export default router;
