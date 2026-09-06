const express = require("express");
const orderRoutes = require("./order.routes");
const analyticsRoutes = require("./analytics.routes");
const archiveRoutes = require("./archive.routes");

const router = express.Router();

router.get("/health", (req, res) => res.json({ success: true, status: "ok" }));
router.use("/orders", orderRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/archive-old-orders", archiveRoutes);

module.exports = router;
