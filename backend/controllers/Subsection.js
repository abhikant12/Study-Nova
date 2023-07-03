const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");



//in course we create many section like chapter_1 , chapter_2 and in section we create many subsection like chapter_1 divided into five topic...
//subsection is final so we upload video in subsection.   
exports.createSubSection = async (req, res) => {
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

            //create a sub-section in DB;
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



//HW: updateSubSection

//HW:deleteSubSection