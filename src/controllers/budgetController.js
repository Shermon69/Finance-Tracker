const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Budget = require("../models/Budget");


//initially setting the budget for a perticular catagory
const setBudget = asyncHandler(async (req, res) => {
    const {catagory , amount} = req.body;

    if(!catagory || !amount ) {
        res.status(400);
        throw new Error("Please provide a catagory and the amount.");
    }

    const user = await User.findById(req.user._id);
    if(!user) {
        res.status(404);
        throw new Error("User is not found");
    }

    //Checking if the budget for the catagory already exists
    // const existingBudget = user.budgets.find(b => b.catagory === catagory);
    let budget = await Budget.findOne({ user: req.user._id, catagory});

    if (budget) {
        budget.amount = amount; //Updating the existing budget
        

    }else {
        budget = new Budget({
            user: req.user._id,
            catagory,
            amount,
            spent:0,
        });
    }

    await budget.save();
    res.json(budget);


});

//Getting all budget details
const getBudget = asyncHandler(async (req, res) => {
    const budgets = await Budget.find({ user: req.user._id});

    // if(!budgets) {
    //     res.status(404);
    //     throw new Error("User not found");
    // }

    res.json(budgets);
});

module.exports = { setBudget , getBudget };