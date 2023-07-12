const RatingAndReview = require("../models/RatingAndRaview");
const Course = require("../models/Course");
const { mongo, default: mongoose } = require("mongoose");


//createRating
const createRating = async (req, res) => {
    try{
        const userId = req.user.id;                                                   //get user id
        const {rating, review, courseId} = req.body;                                 //fetchdata from req body
        const courseDetails = await Course.findOne({_id:courseId, studentsEnrolled:{$elemMatch: {$eq: userId} },  });    //check if user is enrolled or not
                                    
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }
        const alreadyReviewed = await RatingAndReview.findOne({user:userId,  course:courseId,});       //check if user already reviewed the course                                
                                             
        if(alreadyReviewed) {
                    return res.status(403).json({
                        success:false,
                        message:'Course is already reviewed by the user',
                    });
                }
        //create an entry for ratingandreview in RatingAndReview folder in DB;
        const ratingReview = await RatingAndReview.create({
                                        rating, review, 
                                        course:courseId,
                                        user:userId,
                                    });
       
        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push: {ratingAndReviews: ratingReview._id,}
                                    },
                                    {new: true});
    
        return res.status(200).json({                               //return response
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAverageRating
const getAverageRating = async (req, res) => {
    try {
            const courseId = req.body.courseId;                             //get course ID
            
            const result = await RatingAndReview.aggregate([
                {
                    $match:{course: new mongoose.Types.ObjectId(courseId),},        // it find all entry in which id of courses is matched with courseId in RatingAndReview models;
                },
                {
                    $group:{ _id:null,  averageRating: { $avg: "$rating"},}         //all entry grouped into single grouped due to (_id:null) and then find averageRating;
                }
            ])

            if(result.length > 0){                                                   //return rating
                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })}
 
            return res.status(200).json({                                          //if no rating/Review exist
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews
const getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({}).sort({rating: "desc"})  
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();

            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}

module.exports =  {createRating , getAverageRating , getAllRating};