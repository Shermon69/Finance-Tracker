const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { getAllUsers , getAllTransactions } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", protect , adminOnly , getAllUsers);

router.get("/transactions" , protect , adminOnly , getAllTransactions);

module.exports = router;