const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


//createCourse handler function
const createCourse = async (req, res) => {
    try{
        const {courseName, courseDescription, whatYoutWillLearn, price, tag ,category,status,instructions,} = req.body;            //fetch data 
        const thumbnail = req.files.thumbnailImage;                                                 //get thumbnail

        if(!courseName || !courseDescription || !whatYoutWillLearn || !price || !tag || !thumbnail){         //validation
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const userId = req.user.id;                                                     //check for instructor , check we have store user_id in controller/login/payload so we 
        const instructorDetails = await User.findById(userId , {accountType: "Instructor",});     // are fetching instructor id from request;
        if(!instructorDetails) {                                                      //validation of instructor
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }
       
		const categoryDetails = await Category.findById(category);                     // Check if the tag given is valid
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

        //Upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new Course in DB;
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYoutWillLearn,
            price,
            tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
        })

        await User.findByIdAndUpdate(                             //add the new course to the user(instructor) schema means add this course to  
            {_id: instructorDetails._id},                        //instructor schema so all courses created by this instructor is at one place;
            {                                                   // it find id of user which match with instructorDetails._id and then update this course into that id;
                $push: {courses: newCourse._id,}
            },
            {new:true},
        );

        await Tag.findByIdAndUpdate(                              //update the category ka schema 
            {_id: category},                         
            {                                                   
                $push: {courses: newCourse._id,}
            },
            {new:true},
        );    
         
        return res.status(200).json({                                              //return response
            success:true, 
            data:newCourse,
            message:"Course Created Successfully",
        });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }
};


//getAllCourses handler function
const getAllCourses = async (req, res) => {
    try {
             // it find all courses;
            const allCourses = await Course.find(
                    {},
                {
                    courseName: true,
                    price: true,
                    thumbnail: true,
                    instructor: true,
                    ratingAndReviews: true,
                    studentsEnroled: true,
                }
            ) .populate("instructor").exec();                        

            return res.status(200).json({
                success:true,
                message:'Data for all courses fetched successfully',
                data:allCourses,
            })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch course data',
            error:error.message,
        })
    }
}


//getCourseDetails
const getCourseDetails = async (req, res) => {
    try {
            const {courseId} = req.body;                              //get id
            const courseDetails = await Course.find(                   //find course details
                                        {_id:courseId})
                                        .populate({path:"instructor", populate:{path:"additionalDetails", },})
                                        .populate("category")
                                        .populate("ratingAndreviews")
                                        .populate({path:"courseContent", populate:{path:"subSection", },})
                                        .exec();
                if(!courseDetails) {                                     //validation
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                return res.status(200).json({                            //return response
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })
         }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

module.exports =  {createCourse , getAllCourses , getCourseDetails};