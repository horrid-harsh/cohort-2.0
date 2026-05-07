import mongoose from "mongoose";
import { priceSchema } from "./common.schema.js";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        unique: true,
        sparse: true
    },
    guestId: {
        type: String,
        required: false,
        unique: true,
        sparse: true, // Allows multiple nulls but unique for actual strings
        index: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            size: {
                type: String,
                required: [true, "Size is required for cart items"]
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
                max: 10
            },
            price: {
                type: priceSchema,
                required: true
            },
            subtotal: {
                type: priceSchema,
                required: true
            }
        }
    ],
    totalPrice: {
        type: priceSchema,
        default: { amount: 0, currency: "INR" }
    }
},
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            }
        },
        toObject: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            }
        }
    });

export const Cart = mongoose.model("Cart", cartSchema)