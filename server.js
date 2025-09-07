import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/Order.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// POST new order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    console.log("✅ New order saved:", order.id);
    res.json({ success: true, id: order.id });
  } catch (err) {
    console.error("❌ Error saving order:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Root test
app.get("/", (req, res) => {
  res.send("POS Backend API with MongoDB is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 POS Backend running on http://localhost:${PORT}`);
});
