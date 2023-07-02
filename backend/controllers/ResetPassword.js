const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


//resetPasswordToken :- it generate token and send URL with Token to the user;
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;                              //get email from req body
        const user = await User.findOne({email: email});           //check user for this email,find user which email is matched to this email;
        if(!user) {                                                //if there is no any user for this email;
            return res.json({success:false,
            message:'Your Email is not registered'});
        }
       
        const token  = crypto.randomUUID();                          //generate token and we add expiration time in that token and then we add that token
        const updatedDetails = await User.findOneAndUpdate(          // URL so the URL which will be sent to user to reset password will expire after certain time;
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires: Date.now() + 5*60*1000,
                                        },
                                        {new:true});                  // {new:true} added because it return updated object so updatedDetails contain updated details;
        
        const url = `http://localhost:3000/update-password/${token}`                              //create url
        await mailSender(email, "Password Reset Link",`Password Reset Link: ${url}`);             //send mail containing the url
                         
        return res.json({                                                                         //return response
            success:true,
            message:'Email sent successfully, please check email and change pwd',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }
}


//resetPassword/
exports.resetPassword = async (req, res) => {
    try {
        const {password, confirmPassword, token} = req.body;                   //data fetch
        if(password !== confirmPassword) {                                    //validation
            return res.json({
                success:false,
                message:'Password not matching',
            });
        }
       
        const userDetails = await User.findOne({token: token});             //get userdetails from db using token
        if(!userDetails) {                                                 //if no entry - invalid token
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }

        if(userDetails.resetPasswordExpires < Date.now()){                 //token time check 
                return res.json({
                    success:false,
                    message:'Token is expired, please regenerate your token',
                });
        }
         
        const hashedPassword = await bcrypt.hash(password, 10);           //hash password

        //password update IN DB;
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
       
        return res.status(200).json({                             //return response
            success:true,
            message:'Password reset successful',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }
}