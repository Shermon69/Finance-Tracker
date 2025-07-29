const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { setGoal , getGoals , updateGoalProgress } = require("../controllers/goalController");

const router = express.Router();

router.post("/", protect , setGoal);
router.get("/", protect , getGoals);
router.put("/:goalId", protect , updateGoalProgress);

module.exports = router;