const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


//createCourse handler function
exports.createCourse = async (req, res) => {
    try{
        const {courseName, courseDescription, whatYoutWillLearn, price, tag} = req.body;            //fetch data 
        const thumbnail = req.files.thumbnailImage;                                                 //get thumbnail

        if(!courseName || !courseDescription || !whatYoutWillLearn || !price || !tag || !thumbnail){         //validation
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const userId = req.user.id;                                                     //check for instructor , check we have store user_id in controller/login/payload so we 
        const instructorDetails = await User.findById(userId);                         // are fetching instructor id from request;
        if(!instructorDetails) {                                                      //validation of instructor
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }

        const tagDetails = await Tag.findById(tag);                                  //check given tag is valid or not
        if(!tagDetails) {
            return res.status(404).json({
                success:false,
                message:'Tag Details not found',
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
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        await User.findByIdAndUpdate(                             //add the new course to the user(instructor) schema means add this course to  
            {_id: instructorDetails._id},                        //instructor schema so all courses created by this instructor is at one place;
            {                                                   // it find id of user which match with instructorDetails._id and then update this course into that id;
                $push: {courses: newCourse._id,}
            },
            {new:true},
        );

        await Tag.findByIdAndUpdate(                              //update the TAG ka schema 
            {_id: tagDetails._id},                         
            {                                                   
                $push: {courses: newCourse._id,}
            },
            {new:true},
        );    
         
        return res.status(200).json({                                              //return response
            success:true, 
            message:"Course Created Successfully",
            data:newCourse,
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
exports.showAllCourses = async (req, res) => {
    try {
            //TODO: change the below statement incrementally
            const allCourses = await Course.find({});                             // it find all courses;

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
