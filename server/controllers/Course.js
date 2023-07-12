const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")


// Function to create a new course
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id
    let {courseName, courseDescription,  whatYouWillLearn, price,  tag: _tag, category, status,  instructions: _instructions,} = req.body
  
    const thumbnail = req.files.thumbnailImage                         // Get thumbnail image from request files

    const tag = JSON.parse(_tag)                                    //Convert the tag and instructions from stringified Array to Array
    const instructions = JSON.parse(_instructions)

    // Check if any of the required fields are missing
    if(!courseName || !courseDescription || !whatYouWillLearn || !price ||  !tag.length ||  !thumbnail || !category ||  !instructions.length) {
          return res.status(400).json({success: false, message: "All Fields are Mandatory", })
       }
    if(!status || status === undefined){
      status = "Draft"
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {accountType: "Instructor",});
      
    if(!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the category given is valid
    const categoryDetails = await Category.findById(category)
    if(!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME )
    
    // Create a new course with the given details in DB;
    const newCourse = await Course.create({
          courseName,
          courseDescription,
          instructor: instructorDetails._id,
          whatYouWillLearn: whatYouWillLearn,
          price,
          tag,
          category: categoryDetails._id,
          thumbnail: thumbnailImage.secure_url,
          status: status,
          instructions,
        })

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate( { _id: instructorDetails._id,},  {$push: {courses: newCourse._id,},},  {new: true} )
     
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate( { _id: category },  {$push: {courses: newCourse._id,},}, { new: true } )
      
    res.status(200).json({                                      // Return the new course and a success message
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  }
   catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}


// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if(!course){
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if(req.files){
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary( thumbnail,  process.env.FOLDER_NAME )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for(const key in updates) {
      if(updates.hasOwnProperty(key)) {
        if(key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()                                     // save the course;

    const updatedCourse = await Course.findOne({ _id: courseId,})
                          .populate({
                            path: "instructor",
                            populate: {
                              path: "additionalDetails",
                            },
                          })
                          .populate("category")
                          .populate("ratingAndReviews")
                          .populate({
                            path: "courseContent",
                            populate: {
                              path: "subSection",
                            },
                          })
                          .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } 
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find( { status: "Published" }, {courseName: true,  price: true, thumbnail: true, instructor: true, ratingAndReviews: true, studentsEnrolled: true, })
                       .populate("instructor").exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } 
  catch(error){
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}


exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({ _id: courseId, })
                          .populate({
                            path: "instructor",
                            populate: {
                              path: "additionalDetails",
                            },
                          })
                          .populate("category")
                          .populate("ratingAndReviews")
                          .populate({
                            path: "courseContent",
                            populate: {
                              path: "subSection",
                              select: "-videoUrl",
                            },
                          })
                          .exec()

    if(!courseDetails){
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {courseDetails, totalDuration,},
    })
  }
   catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({ _id: courseId, })
                        .populate({
                          path: "instructor",
                          populate: {
                            path: "additionalDetails",
                          },
                        })
                        .populate("category")
                        .populate("ratingAndReviews")
                        .populate({
                          path: "courseContent",
                          populate: {
                            path: "subSection",
                          },
                        })
                        .exec()

    let courseProgressCount = await CourseProgress.findOne({courseID: courseId,  userId: userId,})

    if(!courseDetails){
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [], 
      },
    })
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    
    const instructorId = req.user.id                      // Get the instructor ID from the authenticated user or request body

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({ instructor: instructorId, }).sort({ createdAt: -1 })
      
    res.status(200).json({                     // Return the instructor's courses
      success: true,
      data: instructorCourses,
    })
  }
   catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}


// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    
    const course = await Course.findById(courseId)                     // Find the course
    if(!course){
      return res.status(404).json({ message: "Course not found" })
    }

    const studentsEnrolled = course.studentsEnrolled                   // Unenroll students from the course
    for(const studentId of studentsEnrolled){
      await User.findByIdAndUpdate(studentId, {$pull: { courses: courseId },})
    }

    const courseSections = course.courseContent                   // Delete sections and sub-sections
    for(const sectionId of courseSections) {
      const section = await Section.findById(sectionId)             // Delete sub-sections of the section
      if(section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }
      await Section.findByIdAndDelete(sectionId)           // Delete the section
    }

    await Course.findByIdAndDelete(courseId)                  // Delete the course

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  }
   catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}