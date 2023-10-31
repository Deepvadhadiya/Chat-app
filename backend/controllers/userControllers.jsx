const asyncHandler = require('express-async-handler');
const User = require("../models/userModel.jsx");
const generateToken = require('../config/generateToken.jsx');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400).send({
            success: false,
            message: "Please Enter all the Feilds",
        })
        // throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).send({
            success: false,
            message: "User Already exists",
        });
        // throw new Error("User Already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).send({
            success: false,
            message: "Failed to create the User",
        });
        // throw new Error("Failed to create the User");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).send({
            success: false,
            message: "Invalid Credentials",
        });
    }
});

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {
                name: {
                    $regex: req.query.search, $options: "i"
                },
            },
            {
                email: {
                    $regex: req.query.search, $options: "i"
                },
            },
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
})

module.exports = {
    registerUser,
    authUser,
    allUsers,
}