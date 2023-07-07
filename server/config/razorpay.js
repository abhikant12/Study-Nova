const Razorpay = require("razorpay");

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

// created instance of razorpay, note we make the payment of courses through razorpay;