const Profile = require("../models/Profile");
const User = require("../models/User");


exports.updateProfile = async (req, res) => {
    try{
            const {dateOfBirth="", about="", contactNumber, gender} = req.body;               //get data
            const id = req.user.id;                                                          //get userId
            if(!contactNumber || !gender || !id) {                                          //validation
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
            profileDetails.gender = gender;
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
//Explore -> how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
    try{
        const id = req.user.id;                                       //get id 
        const userDetails = await User.findById({_id : id});                 //validation
        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        } 
        
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});            //delete profile
        await User.findByIdAndDelete({_id:id});                                          //delete user
       
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


exports.getAllUserDetails = async (req, res) => {

    try {
        const id = req.user.id;                 //get id
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