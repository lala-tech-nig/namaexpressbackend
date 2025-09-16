import mongoose from "mongoose";

const SalesSummarySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    sales: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.SalesSummary || mongoose.model("SalesSummary", SalesSummarySchema);
