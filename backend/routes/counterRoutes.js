// routes/counterRoutes.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 🔹 Scan QR
router.get("/scan/:orderId", async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.orderId } });
  if (!order) return res.status(404).json({ message: "Invalid QR" });

  res.json(order);
});

// 🔹 Serve item
router.put("/:id/item/:index/serve", async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const items = order.items;
  items[req.params.index].served = true;

  if (items.every((i) => i.served)) {
    order.status = "completed";
  }

  order.items = items;
  await order.save();

  res.json(order);
});

export default router;
