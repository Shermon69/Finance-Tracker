const cron = require("node-cron");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const { calculateNextDate } = require("../utils/dateUtils");

const sendNotifications = async  () => {
    try {
        console.log("Running notification Job");

        const users = await User.find({});
        const now = new Date();
        const oneDayAhead = new Date(now);
        oneDayAhead.setDate(now.getDate() + 1);

        for(const user of users) {
            let newNotifications = [];

            //CHeck for upcoming transactions
            const recurringTransactions = await Transaction.find({
                user: user._id,
                "recurring.isRecurring": true,
                "recurring.nextDate": { $lte: oneDayAhead },
            });
            
            for (const transaction of recurringTransactions) {
                newNotifications.push({
                    user: user._id,
                    message: `Reminder: Your ${transaction.catagory} payment of $${transaction.amount} is due soon!`,

                });

                //Update the next date for recurring transactions
                transaction.recurring.nextDate = calculateNextDate(transaction.recurring.nextDate, transaction.recurring.frequency);
                await transaction.save();

            }

            //Check for eccessive spending pattern in previous week
            const lastWeek = new Date();
            lastWeek.setDate(now.getDate() - 7);

            const lastWeekExpense = await Transaction.aggregate([
                {
                    $match: {
                        user: user._id,
                        type: "expense",
                        date: { $gte: lastWeek, $lte: now },
                    },
                },
                {
                    $group: {
                        _id: "$user",
                        totalSpent: { $sum: "$amount" },
                    },
                },
            ]);

            if(lastWeekExpense.length > 0 && lastWeekExpense[0].totalSpent > 10000) {
                newNotifications.push({
                    user: user._id,
                    message: `High Spending Alert: You have spent $${lastWeekExpense[0].totalSpent} in the past week`,

                });
            }

            //Saving the notifications in the database 
            if(newNotifications.length > 0) {
                await Notification.insertMany(newNotifications);
            }

        }

        console.log("Notification Job is completed.");
    } catch(error) {
        console.error("Error in notification job.",error);
    }
};

if (process.env.NODE_ENV !== "test") {
    //Making the job to work everyday at midnight
    cron.schedule("0 0 * * *",sendNotifications);
}


module.exports = { sendNotifications };