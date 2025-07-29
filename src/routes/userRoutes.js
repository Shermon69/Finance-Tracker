const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {adminOnly} = require("../middleware/adminMiddleware");
const User = require("../models/User");

const router = express.Router();


router.get("/profile", protect , (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    });

});

//To get all users by admin
router.get("/", protect , adminOnly , async (req, res ) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;