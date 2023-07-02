const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60,                         //otp expires in 5 minutes;
    }
});


//a function -> to send emails of otp by using nodejs module "nodemailer" which was created in "/utils/mailSender"
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){                        //here pre-save means otp is sended before the saving of OTPSchema.
    await sendVerificationEmail(this.email, this.otp);
    next();
}) 



module.exports = mongoose.model("OTP", OTPSchema);

