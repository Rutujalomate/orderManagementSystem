const express = require("express");
const { archiveOldOrders } = require("../controllers/archive.controller");

const router = express.Router();
router.post("/", archiveOldOrders);

module.exports = router;
