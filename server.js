import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/Order.js";
import SalesSummary from "./models/SalesSummary.js";

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

// ------------------- ORDER ROUTES -------------------

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

// ------------------- SALES SUMMARY ROUTES -------------------

// POST daily sales summary
app.post("/api/sales-summary", async (req, res) => {
  try {
    const { date, sales, totalAmount } = req.body;
    if (!date || sales == null || totalAmount == null) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    // Upsert summary for the date
    const summary = await SalesSummary.findOneAndUpdate(
      { date },
      { sales, totalAmount },
      { new: true, upsert: true }
    );

    console.log("✅ Sales summary saved:", summary.date);
    res.json({ success: true, summary });
  } catch (err) {
    console.error("❌ Error saving sales summary:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET all sales summaries
app.get("/api/sales-summary", async (req, res) => {
  try {
    const summaries = await SalesSummary.find().sort({ date: -1 });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------- ROOT -------------------
app.get("/", (req, res) => {
  res.send("POS Backend API with MongoDB is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 POS Backend running on http://localhost:${PORT}`);
});
