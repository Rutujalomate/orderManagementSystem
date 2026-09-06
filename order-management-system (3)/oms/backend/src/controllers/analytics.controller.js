const { Order } = require("../models/order.model");
const asyncHandler = require("../utils/asyncHandler");

const ordersPerDay = asyncHandler(async (req, res) => {
  const { store_id, days = 30 } = req.query;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const match = { created_at: { $gte: since } };
  if (store_id) match.store_id = store_id;

  const result = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
        orders: { $sum: 1 },
        revenue: { $sum: "$total_amount" },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", orders: 1, revenue: 1 } },
  ]);

  res.json({ success: true, data: result });
});

const revenuePerStore = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    { $match: { status: "COMPLETED" } },
    {
      $group: {
        _id: "$store_id",
        total_revenue: { $sum: "$total_amount" },
        order_count: { $sum: 1 },
      },
    },
    { $sort: { total_revenue: -1 } },
    { $project: { _id: 0, store_id: "$_id", total_revenue: 1, order_count: 1 } },
  ]);

  res.json({ success: true, data: result });
});

const topSellingItems = asyncHandler(async (req, res) => {
  const { store_id, limit = 5 } = req.query;
  const match = store_id ? { store_id } : {};

  const result = await Order.aggregate([
    { $match: match },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.item_id",
        name: { $first: "$items.name" },
        total_qty: { $sum: "$items.qty" },
        total_revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      },
    },
    { $sort: { total_qty: -1 } },
    { $limit: Number(limit) },
    { $project: { _id: 0, item_id: "$_id", name: 1, total_qty: 1, total_revenue: 1 } },
  ]);

  res.json({ success: true, data: result });
});

module.exports = { ordersPerDay, revenuePerStore, topSellingItems };
