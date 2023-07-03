const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");



//capture the payment and initiate the Razorpay order
const capturePayment = async (req, res) => {
    
    const {course_id} = req.body;                                       //get courseId and UserID
    const userId = req.user.id;
    if(!course_id){                                                    //validation and valid courseID
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    };
    
    let course;                                                     //valid courseDetail
    try{
        course = await Course.findById(course_id);
        if(!course) { 
            return res.json({
                success:false,
                message:'Could not find the course',
            });
        }
       
        const uid = new mongoose.Types.ObjectId(userId);              // we convert userId(string) to object_id in mongoose and then we check that this object_id is 
        if(course.studentsEnrolled.includes(uid)) {                   // include in course or not; because the type of studentsEnrolled is also objectId;
            return res.status(200).json({                             
                success:false,
                message:'Student is already enrolled',
            });
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    
    const amount = course.price;                             //order create
    const currency = "INR";

    const options = {                                       // order details;
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),           //receipt number; 
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
        const paymentResponse = await instance.orders.create(options);                     //initiate the payment using razorpay
        console.log(paymentResponse);
         
        return res.status(200).json({                                    //return response
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    }
    catch(error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
    

};


//verify Signature of Razorpay and Server
const verifySignature = async (req, res) => {

    const webhookSecret = "12345678";
    const signature = req.headers["x-razorpay-signature"];

    const shasum =  crypto.createHmac("sha256", webhookSecret);        //create hashing object known as Hmax to do this need two things 1st is sha256 and Secret_key;
    shasum.update(JSON.stringify(req.body));                           // converted object into string format;
    const digest = shasum.digest("hex");                              // converted into hexdecimal format;

    if(signature === digest) {
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
                //fulfil the action
                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push:{studentsEnrolled: userId}},
                                                {new:true},
                );

                if(!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:'Course not Found',
                    });
                }
                console.log(enrolledCourse);

                //find the student and add the course to their list enrolled courses me 
                const enrolledStudent = await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push:{courses:courseId}},
                                                {new:true},
                );
                console.log(enrolledStudent);

                //mail send krdo confirmation wala 
                const emailResponse = await mailSender(enrolledStudent.email, "Congratulations from Study Notion", "Congratulations, you are onboarded into new Study Notion Course",); 
    
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and COurse Added",
                });
        }       
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
};


module.exports =  {capturePayment , verifySignature};