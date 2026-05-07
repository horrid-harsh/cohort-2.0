import mongoose from "mongoose";

export const priceSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true,
    min: [0, "Price cannot be negative"]
  },
  currency: { 
    type: String, 
    enum: ["INR", "USD"], 
    default: "INR" 
  },
  discountedAmount: {
    type: Number,
    default: function() { return this.amount; }
  }
}, { _id: false });
