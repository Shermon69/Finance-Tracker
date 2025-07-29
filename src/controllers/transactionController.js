const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const { calculateNextDate } = require("../utils/dateUtils");
const User = require("../models/User");
const { getExchangeRates , BASE_CURRENCY } = require("../utils/currencyUtils");
const Budget = require("../models/Budget");
const Notification = require("../models/Notification");

// Adding a transaction 
const addTransactions = asyncHandler(async (req, res) => {

    const {type , catagory , amount , date , note , tags, currency, recurring } = req.body;

    if(!type || !catagory || !amount || !currency ) {
        res.status(400);
        throw new Error("please fill all the required fields.")
    }

    //Fetching exchange rates and converting them to the base currency amount (LKR)
    const exchangeRate = await getExchangeRates(currency);
    const baseCurrency = amount / exchangeRate; //convert to LKR

    let simplifiedTags = [];
    if(tags && Array.isArray(tags)){
        simplifiedTags = [...new Set (tags.map(tag => tag.toLowerCase()))];  //To convert the tags to lowerCases and to remove the duplicates
    } /** new Set - Automatically removes duplicates. It's an inbuilt js function
          ...Set - to convert back to an array -  */


    //Calculating the next recurring Date
    let nextDate = null;
    if (recurring && recurring.isRecurring) {
        if(!recurring.frequency) {
            res.status(400);
            throw new Error("Recurring payments must have a frequency");
        }
        nextDate = calculateNextDate(date || new Date(), recurring.frequency);
    }

    //Creating the transaction
    const transaction = await Transaction.create({
        user: req.user._id,
        type,
        catagory,
        amount,
        baseCurrency,
        date: date || new Date(),
        note,
        tags: simplifiedTags,
        recurring: {
            isRecurring: recurring?.isRecurring || false,
            frequency: recurring?.frequency || null,
            nextDate,
        },
        currency: currency.toUpperCase(), // to store the currency in uppercase always
    });

    //Updating the user's budget whenever a transaction in done
    const budget = await Budget.findOne({user: req.user._id, catagory});

    if (budget) {
        // const budget = user.budgets.find(b => b.catagory === catagory);
        
            budget.spent += amount;

            //sending budget exceeding notification
            if(budget.spent > budget.amount) {

                console.log(`ALERT!!! Budget limit exceeded for catagory ${catagory}`);
                const message = `Budget exceeded for ${catagory}. spent: $${budget.spent} / Budget: $${budget.amount}`;
                
                await Notification.create({
                    user: req.user._id,
                    message,
                });
            }

            await budget.save();
        
    }

    res.status(201).json(transaction);
});


//Updating a transaction
const updateTransactions = asyncHandler(async (req, res) =>{

    //Finding the specific transaction
    const transaction = await Transaction.findById(req.params.id);

    if(!transaction) {
        res.status(404);
        throw new Error("Transaction is not Found");
    }

    //checking if the user is logged in
    if(transaction.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Only authorized user can update this transaction");
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedTransaction);

});

//Deleting a transaction
const deleteTransactions = asyncHandler(async (req, res) => {

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error("Transaction is not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Only authorized user can delete the transaction")
    }

    await transaction.deleteOne();
    res.json({message: "Transaction is successfully deleted"});


});

//Getting all transactions
const getTransactions = asyncHandler(async (req, res) => {

    const { currency } = req.query;
    const { tag } = req.query; //to get the tags from quary

    let filter = {user: req.user._id};
    

    if(tag) {
        filter.tags = tag; //Filtering transactions by tag
    }

    if(currency) {
        filter.currency = currency.toUpperCase();
    }

    //const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    const transactions = await Transaction.find(filter).sort({ date: -1});
    res.json(transactions);
});

module.exports = {addTransactions, updateTransactions, deleteTransactions, getTransactions};

