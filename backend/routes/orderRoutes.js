// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* ================= CREATE ORDER AFTER PAYMENT ================= */
router.post("/", async (req, res) => {
  try {
    const { userName, paymentId, items, totalAmount } = req.body;

    if (!paymentId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order payload" });
    }

    // ✅ Prevent duplicate orders
    const existingOrder = await Order.findOne({ where: { paymentId } });
    if (existingOrder) {
      return res.status(409).json({
        message: "Order already exists for this payment",
        order: existingOrder,
      });
    }

    const order = await Order.create({
      userName: userName || "Customer",
      paymentId,
      items: items.map((i) => ({
        _id: i._id,
        name: i.name,
        price: Number(i.price || 0),
        quantity: Number(i.quantity || 1),
        image: i.image || "",
        served: false,
        servedQty: 0,
      })),
      totalAmount: Number(totalAmount || 0),
      status: "pending",
    });

    res.json(order);
  } catch (err) {
    console.error("❌ Create order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/* ================= ADMIN: GET ALL ORDERS ================= */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(orders || []);
  } catch (err) {
    console.error("❌ Fetch orders failed:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ================= COUNTER: GET PENDING ORDERS ================= */
router.get("/counter/pending", async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: "pending" },
      order: [["createdAt", "ASC"]],
    });
    res.json(orders || []);
  } catch (err) {
    console.error("❌ Fetch pending orders failed:", err);
    res.status(500).json({ message: "Failed to load pending orders" });
  }
});

/* ================= COUNTER: SCAN QR ================= */
router.get("/counter/scan/:paymentId", async (req, res) => {
  try {
    const raw = req.params.paymentId || "";
    const paymentId = raw.replace("ORDER-", "").trim();

    const order = await Order.findOne({ where: { paymentId } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🚫 Block re-scan if already delivered
    if (order.status === "completed") {
      return res.status(409).json({
        message: "Order already delivered",
        alreadyServed: true,
        order,
      });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ QR scan failed:", err);
    res.status(500).json({ message: "Scan failed" });
  }
});

/* ================= COUNTER: SERVE ITEM (PARTIAL QTY) ================= */
router.put("/counter/:orderId/item/:index/serve", async (req, res) => {
  try {
    const { orderId, index } = req.params;
    const qty = Number(req.body.qty || 1);

    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Invalid serve quantity" });
    }

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "completed") {
      return res.status(409).json({ message: "Order already completed" });
    }

    const items = Array.isArray(order.items) ? order.items : [];
    if (!items[index]) {
      return res.status(400).json({ message: "Invalid item index" });
    }

    const item = items[index];
    const remaining = Number(item.quantity) - Number(item.servedQty || 0);

    if (qty > remaining) {
      return res.status(400).json({
        message: `Only ${remaining} remaining for ${item.name}`,
      });
    }

    item.servedQty = Number(item.servedQty || 0) + qty;

    if (item.servedQty >= item.quantity) {
      item.servedQty = item.quantity;
      item.served = true;
    }

    order.items = items;

    const allServed = items.every((i) => i.served === true);
    if (allServed) {
      order.status = "completed";
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("❌ Serve item failed:", err);
    res.status(500).json({ message: "Failed to mark item served" });
  }
});

/* ================= COUNTER: STATS ================= */
router.get("/counter/stats", async (req, res) => {
  try {
    const today = new Date().toDateString();
    const orders = await Order.findAll();

    const pending = orders.filter((o) => o.status === "pending").length;

    const servedToday = orders.filter(
      (o) =>
        o.status === "completed" &&
        new Date(o.updatedAt).toDateString() === today
    ).length;

    const revenueToday = orders
      .filter((o) => new Date(o.createdAt).toDateString() === today)
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    res.json({ pending, servedToday, revenueToday });
  } catch (err) {
    console.error("❌ Counter stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

export default router;
