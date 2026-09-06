const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    item_id: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ORDER_STATUSES = ["PLACED", "PREPARING", "COMPLETED"];

const orderSchema = new Schema(
  {
    store_id: { type: String, required: true, index: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: (v) => v.length > 0,
    },
    total_amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: "PLACED" },
    created_at: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

orderSchema.index({ store_id: 1, created_at: -1 });

module.exports = { Order: mongoose.model("Order", orderSchema), ORDER_STATUSES, orderSchema };
