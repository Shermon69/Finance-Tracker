const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, //Defining the type
            required: true, //Setting the field to required
        },
        email: {
            type: String,
            required: true,
            unique: true, //to ensure no duplicate emails
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"], //defining the roles
            default: "user",  //setting the default role as user
        },
        // budgets: [
        //     {
        //         catagory: {type: String, required: true},
        //         amount: {type: Number, required: true},
        //         spent: {type: Number, default: 0},
        //     },
        // ],
        // notification: [
        //     {
        //         message: {type: String, require: true},
        //         date: {type: Date, default: Date.now},
        //         read: {type: Boolean, default: false}, //To see if the user has already read it
        //     },
        // ],
        // goals: [
        //     {
        //         name: {type: String, required: true},
        //         targetAmount: {type: Number, required: true },
        //         savedAmount: {type: Number, default: 0},
        //         deadline: { type: Date, required: false},
        //     },
        // ],
    },
    { timestamps: true } //to add createdAt and updatedat fields
);

const User = mongoose.model("User",userSchema);

module.exports = User;
