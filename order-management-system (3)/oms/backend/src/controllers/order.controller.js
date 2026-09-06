const { Order } = require("../models/order.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { emitToStore } = require("../config/socket");

const createOrder = asyncHandler(async (req, res) => {
  const { store_id, items, total_amount } = req.body;

  let total = 0;
  for (const it of items) {
    total += it.qty * it.price;
  }
  if (total_amount) total = total_amount;

  const order = await Order.create({
    store_id,
    items,
    total_amount: total,
    status: "PLACED",
  });

  emitToStore(store_id, "order:created", order);

  res.status(201).json({ success: true, data: order });
});

const getOrdersByStore = asyncHandler(async (req, res) => {
  const { store_id, status } = req.query;

  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;
  if (page < 1) page = 1;
  if (limit < 1 || limit > 100) limit = 20;
  const skip = (page - 1) * limit;

  const filter = { store_id };
  if (status) filter.status = status;

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit).lean();

  res.json({
    success: true,
    data: orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) throw new ApiError(404, "order not found");
  res.json({ success: true, data: order });
});

const STATUS_FLOW = {
  PLACED: ["PREPARING"],
  PREPARING: ["COMPLETED"],
  COMPLETED: [],
};

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "order not found");

  if (order.status !== status && !STATUS_FLOW[order.status].includes(status)) {
    throw new ApiError(400, `can't go from ${order.status} to ${status}`);
  }

  order.status = status;
  await order.save();

  emitToStore(order.store_id, "order:status_updated", {
    id: order._id,
    store_id: order.store_id,
    status: order.status,
  });

  res.json({ success: true, data: order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "order not found");

  if (order.status !== "PLACED") {
    throw new ApiError(400, "can only cancel an order that's still PLACED");
  }

  await order.deleteOne();
  emitToStore(order.store_id, "order:cancelled", { id: order._id, store_id: order.store_id });

  res.json({ success: true, message: "order cancelled" });
});

module.exports = { createOrder, getOrdersByStore, getOrderById, updateOrderStatus, cancelOrder };
