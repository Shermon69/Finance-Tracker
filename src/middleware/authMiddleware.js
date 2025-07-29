const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

//middleware to protect routes by checking jwt token
const protect = asyncHandler(async (req, res, next ) => {
    let token;

    //check if authorization header exists and starts with a bearer 
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            //Extract the token (remove Bearer from the string)
            token = req.headers.authorization.split(" ")[1];

            //Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //fetch the user from the database (excluding the password)
            req.user = await User.findById(decoded.id).select("-password");

            //proceed to the next middleware or route
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("token failed, Not authorized.")
        }
    }
    	//If the token is not found
    if (!token) {
        res.status(401);
        throw new Error("Token is not provided, Not authorized")
    }

});

module.exports = { protect };