import express from "express";
import Report from "../models/Report.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth(), async (req, res) => {
  res.json(await Report.create(req.body));
});

router.get("/", auth("admin"), async (_, res) => {
  res.json(await Report.find());
});

export default router;
