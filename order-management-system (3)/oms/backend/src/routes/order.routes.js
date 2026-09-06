const express = require("express");
const validate = require("../middlewares/validate");
const { createOrderSchema, updateStatusSchema, listOrdersQuerySchema } = require("../validators/order.validator");
const {
  createOrder,
  getOrdersByStore,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/", validate(createOrderSchema, "body"), createOrder);
router.get("/", validate(listOrdersQuerySchema, "query"), getOrdersByStore);
router.get("/:id", getOrderById);
router.patch("/:id/status", validate(updateStatusSchema, "body"), updateOrderStatus);
router.delete("/:id", cancelOrder);

module.exports = router;
