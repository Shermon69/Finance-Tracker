const cron = require("node-cron");
const Transaction = require("../models/Transaction");
const {calculateNextDate } = require("../utils/dateUtils");

const processRecurringTransactions = async () => {
    try {
        const today = new Date();
        today.setHours(0,0,0,0);

        //Pick the payments that should happen today
        const duePayments = await Transaction.find({
            "recurring.isRecurring": true,
            "recurring.nextDate": {$lte: today},
        });

        for (const transaction of duePayments) {
            //Creating a new transaction using the same details
            const newTransaction = new Transaction({
                user: transaction.user,
                type: transaction.type,
                catagory: transaction.catagory,
                amount: transaction.amount,
                baseCurrency: transaction.baseCurrency,  // Ensure baseCurrency is carried forward
                currency: transaction.currency,
                date: today,
                note: transaction.note,
                tags: transaction.tags,
                recurring: {
                    isRecurring: false,
                    frequency: null,
                    nextDate: null,
                },
            });

            await newTransaction.save();

            //updating the next ppayment date
            transaction.recurring.nextDate = calculateNextDate(today, transaction.recurring.frequency);
            await transaction.save();
        }
    } catch (error) {
        console.error("Errors is processing the recurring transactions", error);
    }
};

if (process.env.NODE_ENV !== "test") {
    cron.schedule("0 0 * * *", () =>{
        console.log("Running recurring transaction job..");
        processRecurringTransactions();
    });

}


module.exports = { processRecurringTransactions };