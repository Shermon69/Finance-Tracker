//Loading environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db"); //importing DB connection function

const { processRecurringTransactions } = require("./jobs/recurringTransactions");

const { sendNotifications } = require("./jobs/notificationJob");

sendNotifications();
processRecurringTransactions();

const app = express();

//DB connection
connectDB();

//middleware
app.use(express.json()); //parse json request bodies
app.use(cors()); //Enable cross-origin resource sharing
app.use(helmet()); //security headers
app.use(morgan("dev")); //Logging

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/notifications/read", require("./routes/notificationRoutes"));

app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/goals",require("./routes/goalRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));



//Test Routes
app.get("/", (req, res) => {
    res.send("API is running..");
});

//start server
if (process.env.NODE_ENV !== "test") {  //for testing
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
  });
}

module.exports = app;


 
