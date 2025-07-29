const mongoose = require ("mongoose");

const budgetSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    catagory: {type: String, required: true},
    amount: {type: Number, required: true},
    spent: {type: Number, default: 0},
    });

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;