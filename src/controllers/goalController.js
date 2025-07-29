const asyncHandler = require("express-async-handler");
const Goal = require("../models/Goal");
const Notification = require("../models/Notification");


//Creating a goal
const setGoal = asyncHandler(async (req, res) => {

    const { name , targetAmount , deadline } = req.body;

    if ( !name || !targetAmount ) {
        res.status(400);
        throw new Error("Plese provide the Goal name and the Target Amount.");
    }

    // const user = await User.findById(req.user._id);
    // if (!user) {
    //     res.status(404);
    //     throw new Error("User not found.");
    // }

    const newGoal = new Goal ({
        user: req.user._id,
        name,
        targetAmount,
        savedAmount: 0,
        deadline,
    });
    

    await newGoal.save();
    res.status(201).json(newGoal);
});

// to get all goal details of the user
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({user: req.user._id});
    
    // if(!user) {
    //     res.status(404);
    //     throw new Error("user not found");
    // }


    res.json(goals);
});

// Updating the progress of the goal
const updateGoalProgress = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const { goalId } = req.params;

    if(!amount) {
        res.status(400);
        throw new Error("Please provide an amount to add to your savings.");
    }

    const goal = await Goal.findOne({_id: goalId, user: req.user._id}); 
    
    if(!goal) {
        res.status(404);
        throw new Error ("Goal not found");
    }

    goal.savedAmount += amount;
    //const goal = user.goals.id(goalId);
    
    //Notifying the user if the goal is achieved
    if(goal.savedAmount >= goal.targetAmount) {
        await Notification.create({
            user: req.user._id,
            message: `Congratulations! You have achieved your goal of ${goal.name}.`,
        });
            
    }

    await goal.save();
    res.json(goal);

});

module.exports = { setGoal , getGoals , updateGoalProgress };
