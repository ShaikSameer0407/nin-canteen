import Stock from "../models/Stock.js";

export const getStock = async (req, res) => {
  const stock = await Stock.find();
  res.json(stock);
};

export const addStock = async (req, res) => {
  const { itemName, quantity, price } = req.body;
  const stock = await Stock.create({ itemName, quantity, price });
  res.status(201).json(stock);
};

export const deleteStock = async (req, res) => {
  await Stock.findByIdAndDelete(req.params.id);
  res.json({ message: "Stock deleted" });
};
