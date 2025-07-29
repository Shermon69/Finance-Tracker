const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const Report = require("../models/Report");

const generateFinancialReport = asyncHandler(async (req, res) => {
    const {startDate , endDate } = req.query;

    //Convert Date strings to Date objects
    const start = startDate ? new Date(startDate) : new Date("2025-01-01"); //If start date is not provided the default start date is this
    const end = endDate ? new Date(endDate) : new Date(); //if not provided default is current date

    //To include the transaction which are happened on the end date
    end.setHours(23 , 59 , 59 , 999);


    const transactions = await Transaction.find({
        user: req.user._id,
        date: {$gte: start, $lte: end}, //greater than or equal to start , less than or equal to end
    });

    //Calculate the total income
    let totalIncome = 0;
    let totalExpenses = 0;

    const catagoryBreakdown = {}; //To get the amount of each catagory 

    transactions.forEach((transaction) => {

        if(transaction.type === "income") {
            totalIncome += transaction.amount;

        }else if (transaction.type === "expense") {
            totalExpenses += transaction.amount;
        }

        //Track spendings for each catagory
        if (!catagoryBreakdown[transaction.catagory]) {
            catagoryBreakdown[transaction.catagory] = 0;
        }
        catagoryBreakdown[transaction.catagory] += transaction.amount;
    });

    const newReport = new Report ({
        user: req.user._id,
        totalIncome,
        totalExpenses: totalExpenses,
        netSavings: totalIncome - totalExpenses,
        catagoryBreakdown,
    });
    
    await newReport.save();
    res.status(201).json(newReport);
    
});

const getFinancialReport = asyncHandler(async (req, res) => {
    const reports = await Report.find({user: req.user._id});

    res.json(reports);
});

module.exports = { generateFinancialReport, getFinancialReport };