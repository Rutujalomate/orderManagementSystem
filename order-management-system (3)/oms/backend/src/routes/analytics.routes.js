const express = require("express");
const { ordersPerDay, revenuePerStore, topSellingItems } = require("../controllers/analytics.controller");

const router = express.Router();

router.get("/orders-per-day", ordersPerDay);
router.get("/revenue-per-store", revenuePerStore);
router.get("/top-items", topSellingItems);

module.exports = router;
