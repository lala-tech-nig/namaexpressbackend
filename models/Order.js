import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // frontend-generated order id
    items: [ItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
