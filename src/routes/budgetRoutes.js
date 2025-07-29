const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { setBudget , getBudget } = require("../controllers/budgetController");

const router = express.Router();

router.post("/",protect , setBudget);
router.get("/", protect , getBudget);

module.exports = router;
