const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,  //Links the relavant user
            ref: "User", //referencing the user model
            require: true,
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        catagory: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now // to add the current date
        },
        note: {
            type: String,
        },
        tags: {
            type: [String], //Array
            default: [],
        },
        recurring: {
            isRecurring: {type: Boolean, default: false},  //Define whether it's a recurring payment or not
            frequency: {
                type: String,
                enum: ["daily","weekly","monthly","Yearly"], //To define the requency of the payments
                default: null, 
            },
            nextDate: {type: Date, default: null}, //To get the next Occurance date
        },
        currency: { 
            type: String, default: "LKR"
        },
        baseCurrency: {
            type: String,
            required: true,
        }



    },
    { timestamps: true}

);

const Transaction = mongoose.model("Transaction",transactionSchema);

module.exports = Transaction;