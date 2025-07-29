const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

//function to get the notification from transaction controller
const getNotifications = asyncHandler(async (req, res) => {

    const notificatios = await Notification.find({user: req.user._id});

    // if(!user) {
    //     res.status(404);
    //     throw new Error("User not found");

    // }

    res.json(notificatios);
});

//Marking the read field if the user read it
const markRead = asyncHandler( async (req, res) => {

    await Notification.updateMany({ user: req.user._id}, {read: true});

    // if(!user) {
    //     res.status(404);
    //     throw new Error ("User not found");
    // }
    
    // user.notification.forEach(notification => {
    //     notification.read = true;
    // });    
    res.json({ message: "All Notifications are Marked as read"});
});

module.exports = { getNotifications , markRead };