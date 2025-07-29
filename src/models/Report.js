const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    totalIncome: {type: Number, required: true},
    totalExpenses: {type: Number, required: true},
    netSavings: {type: Number, required: true},
    catagoryBreakdown: {type: Object, required: true},
    generatedAt: {type: Date, default: Date.now},
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
