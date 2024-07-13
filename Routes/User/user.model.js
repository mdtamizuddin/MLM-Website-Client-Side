const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minlength: 5,
        required: [true, "Username is required (minimum 5 characters)"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Please select your gender"],
    },
    education: {
        type: String,
        required: [true, "Please enter your education details"],
    },
    phone: {
        type: String,
        required: [true, "Please enter your phone number"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: 6, 
    },
    paymentMethod: {
        type: String,
        required: [true, "Please select a payment method"],
    },
    account: {
        type: String,
        required: [true, "Account information is required"],
    },
    trx: {
        type: String,
        required: [true, "Transaction details are required"],
    },
    time: {
        type: Date, 
        required: [true, "Please provide the time information"],
    },
    reffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    fbId: {
        type: String,
        required: [true, "Facebook ID is required"],
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true, 
});
const User = mongoose.model("User", userSchema);
module.exports = User;
