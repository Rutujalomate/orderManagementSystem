const { Order } = require("../models/order.model");
const OrderArchive = require("../models/orderArchive.model");
const asyncHandler = require("../utils/asyncHandler");

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const archiveOldOrders = asyncHandler(async (req, res) => {
  const cutoff = new Date(Date.now() - THIRTY_DAYS);
  const BATCH_SIZE = 500;
  let count = 0;

  while (true) {
    const batch = await Order.find({ created_at: { $lt: cutoff } }).limit(BATCH_SIZE).lean();
    if (batch.length === 0) break;

    const toArchive = batch.map((o) => ({ ...o, archived_at: new Date() }));
    await OrderArchive.insertMany(toArchive, { ordered: false });
    await Order.deleteMany({ _id: { $in: batch.map((o) => o._id) } });

    count += batch.length;
    if (batch.length < BATCH_SIZE) break;
  }

  res.json({ success: true, message: `archived ${count} orders`, archived_count: count });
});

module.exports = { archiveOldOrders };
