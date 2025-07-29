const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getFinancialReport, generateFinancialReport } = require("../controllers/reportController");

const router = express.Router();

router.post("/generate", protect, generateFinancialReport);
router.get("/", protect , getFinancialReport);

module.exports = router;

