const express = require("express")
const router = express.Router()


// Routes for deleteprofile , updateprofile ,getuserdetails , getEnrolledCourse , updateDisplayPicture;


const { auth } = require("../middlewares/auth")
const {deleteAccount, updateProfile, getAllUserDetails, updateDisplayPicture,  getEnrolledCourses,} = require("../controllers/Profile")
   
    
// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************
router.delete("/deleteProfile", auth, deleteAccount)                        // Delet User Account
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)                  // Get Enrolled Courses
router.put("/updateDisplayPicture", auth, updateDisplayPicture)



module.exports = router

 