const asyncHandler = require("express-async-handler");

//middleware to restrict access to admin users only
const adminOnly = asyncHandler(async (req, res, next ) => {
    if(req.user &&  req.user.role === "admin") {
        next(); //continue to the route handler
    }else {
        res.status(403);
        throw new Error("Access denied. Admin only");
    }
});

module.exports = { adminOnly };