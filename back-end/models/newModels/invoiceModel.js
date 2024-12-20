// Backend: Mongoose Schema
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  totals: {
    subtotal: { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
  },
  paymentStatus: { type: String, enum: ["Paid", "Unpaid", "Part Paid"], required: true }, // Add paymentStatus
});

export default mongoose.model('Invoice', invoiceSchema);