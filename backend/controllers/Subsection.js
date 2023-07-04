const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");



//in course we create many section like chapter_1 , chapter_2 and in section we create many subsection like chapter_1 divided into five topic...
//subsection is final so we upload video in subsection.   
const createSubSection = async (req, res) => {
    try{
            const {sectionId, title, timeDuration, description} = req.body;                        //fecth data from Req body
            const video  = req.files.videoFile;                                                   //extract file/video
            if(!sectionId || !title || !timeDuration || !description || !video){                //validation
                return res.status(400).json({
                    success:false,
                    message:'All fields are required',
                });
            }

            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);        //upload video to cloudinary

            //create a sub-section in SubSection in DB;
            const subSectionDetails = await SubSection.create({
                title:title,
                timeDuration:timeDuration,
                description:description,
                videoUrl:uploadDetails.secure_url,
            })

            //update section with this sub section ObjectId, here sectionId is id of section in which this subsection is present;
            const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                        {$push:{subSection:subSectionDetails._id,}},
                                                        {new:true}).populate("subSection");

            
            return res.status(200).json({                                          //return response
                succcess:true,
                message:'Sub Section Created Successfully',
                updatedSection,
            });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
};

  
const updateSubSection = async (req, res) => {
    try {
      const { subsectionId, title, description } = req.body;
      const subSection = await SubSection.findById(subsectionId);
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      return res.json({
        success: true,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
};
  

const deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
};


module.exports = {createSubSection , updateSubSection , deleteSubSection};
 