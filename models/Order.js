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
    status: { 
      type: String, 
      enum: ["pending", "completed", "Sold"], 
      default: "Sold" 
    },
    receiptImage: { type: String } // base64 string or external URL (e.g. Cloudinary)
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
