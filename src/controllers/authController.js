const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { json } = require("express");

//@desc Register new user
//@route POST/api/auth/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, role } = req.body;

    //Checks if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already Exists.");
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user", //setting default role user
    });

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }else {
        res.status(400);
        throw new Error ("Invalid user data");
    }
});

//Generating JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d"});
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
// @access Public

const loginUser = asyncHandler( async (req, res) => {
    const { email, password} = req.body;

    const user = await User.findOne({ email }); //checkinh if the email address exists

    //login using the hashed password
    if (user && (await bcrypt.compare(password, user.password))) {  //Comparing the entered password and the stored password in the db
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), //sending the token 
        });
    } else {
        res.status(401);
        throw new Error("invalid email or password"); //Returning an error if the email is not found
    }

});

module.exports = { registerUser, loginUser };



