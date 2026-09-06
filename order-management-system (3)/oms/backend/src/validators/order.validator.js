const { z } = require("zod");
const { ORDER_STATUSES } = require("../models/order.model");

const orderItemSchema = z.object({
  item_id: z.string().min(1),
  name: z.string().min(1),
  qty: z.number().int().positive(),
  price: z.number().nonnegative(),
});

const createOrderSchema = z.object({
  store_id: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  total_amount: z.number().nonnegative().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

const listOrdersQuerySchema = z.object({
  store_id: z.string().min(1),
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(ORDER_STATUSES).optional(),
});

module.exports = { createOrderSchema, updateStatusSchema, listOrdersQuerySchema };
