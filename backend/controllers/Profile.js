const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


const updateProfile = async (req, res) => {
    try{
            const {dateOfBirth="", about="", contactNumber} = req.body;                //get data entered by user;
            const id = req.user.id;                                                    //get userId , here user is logined so he updated  his profile;
            if(!contactNumber || !id) {                                                //validation
                return res.status(400).json({
                    success:false,
                    message:'All fields are required',
                });
            } 
            //find profile
            const userDetails = await User.findById(id);                                
            const profileId = userDetails.additionalDetails;
            const profileDetails = await Profile.findById(profileId);

            //update profile
            profileDetails.dateOfBirth = dateOfBirth;
            profileDetails.about = about;
            profileDetails.contactNumber = contactNumber;
            await profileDetails.save();
           
            return res.status(200).json({                                  //return response
                success:true,
                message:'Profile Updated Successfully',
                profileDetails,
            });
        }
    catch(error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
};  


//deleteAccount
const deleteAccount = async (req, res) => {
    try{
        const id = req.user.id;                                                //get id 
        const userDetails = await User.findById({_id : id});                 //validation
        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        } 
        
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});            //delete account from profiles
        await User.findByIdAndDelete({_id:id});                                          //delete account from users
       
        return res.status(200).json({                                      //return response
            success:true,
            message:'User Deleted Successfully',
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted successfully',
        });
    }
};


const getAllUserDetails = async (req, res) => {

    try {
        const id = req.user.id;                                           //get userId , here user is logined so he updated  his profile;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();           //validation and get user details
      
        return res.status(200).json({                              //return response
            success:true,
            message:'User Data Fetched Successfully',
            data : userDetails,
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


const updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id

      const image = await uploadImageToCloudinary( displayPicture, process.env.FOLDER_NAME,  1000,  1000 )
        
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate( { _id: userId }, { image: image.secure_url },  { new: true } )
        
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

  
const getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({ _id: userId,}).populate("courses").exec()
      
      if(!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};


module.exports =  {updateProfile , deleteAccount , getAllUserDetails , updateDisplayPicture , getEnrolledCourses};