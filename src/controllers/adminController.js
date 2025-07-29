const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

//To get all users details. Admin only
const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select("-password"); //To exclude the password
    res.json(users);
});

//to get all transaction details
const getAllTransactions = asyncHandler(async (req, res) => {

    const transactions = await Transaction.find().populate("user","name email");
    res.json(transactions);
});

module.exports = {getAllUsers , getAllTransactions};
