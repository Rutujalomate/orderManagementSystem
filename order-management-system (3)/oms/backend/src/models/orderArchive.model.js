const mongoose = require("mongoose");
const { orderSchema } = require("./order.model");

const archiveSchema = orderSchema.clone();
archiveSchema.add({ archived_at: { type: Date, default: Date.now } });

module.exports = mongoose.model("OrderArchive", archiveSchema, "orders_archive");
