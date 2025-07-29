const express =  require("express");
const{ protect } = require("../middleware/authMiddleware");

const {
    getTransactions,addTransactions,updateTransactions,deleteTransactions
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", protect , getTransactions);
router.post("/", protect , addTransactions);
router.put("/:id", protect , updateTransactions);
router.delete("/:id", protect , deleteTransactions);

module.exports = router;


