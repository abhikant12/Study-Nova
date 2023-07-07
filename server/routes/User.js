const express = require("express")
const router = express.Router()

// Routes for Login, Signup,sendotp ,changepassword  and Authentication and resetpassword;


// Import the required controllers and middleware functions
const { login, signUp, sendOTP, changePassword,} = require("../controllers/Auth")
const { resetPasswordToken,  resetPassword,} = require("../controllers/ResetPassword")
const { auth } = require("../middlewares/auth")


// ********************************************************************************************************
//                                      Authentication routes                                             *
// ********************************************************************************************************
router.post("/login", login)                      // Route for user login
router.post("/signup", signUp)                    // Route for user signup
router.post("/sendotp", sendOTP)                  // Route for sending OTP to the user's email
router.post("/changepassword", auth, changePassword)     // Route for Changing the password



// ********************************************************************************************************
//                                      Reset Password                                                    *
// ********************************************************************************************************
router.post("/reset-password-token", resetPasswordToken)                 // Route for generating a reset password token
router.post("/reset-password", resetPassword)                          // Route for resetting user's password after verification


module.exports = router

 