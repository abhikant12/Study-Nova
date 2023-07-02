const Section = require("../models/Section");
const Course = require("../models/Course");



//in course we create many section like chapter_1 , chapter_2 and in section we create many subsection like chapter_1 divided into five topic...
exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;                               //data fetch
        if(!sectionName || !courseId) {                                          //data validation
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        //create section in DB;
        const newSection = await Section.create({sectionName});

        //update course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{ courseContent:newSection._id, } 
                                            },
                                            {new:true},
                                        );
       
        return res.status(200).json({                              //return response
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:error.message,
        });
    }
}


exports.updateSection = async (req,res) => {
    try {
        const {sectionName, sectionId} = req.body;                  //data input
        if(!sectionName || !sectionId) {                           //data validation
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }
        
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});            //update data

        return res.status(200).json({                              //return res
            success:true,
            message:'Section Updated Successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again",
            error:error.message,
        });
    }
};


exports.deleteSection = async (req,res) => {
    try {
        const {sectionId} = req.params                          //get ID - assuming that we are sending ID in params
        await Section.findByIdAndDelete(sectionId);             //use findByIdandDelete

        //TODO[Testing]: do we need to delete the entry from the course schema ??
        
        return res.status(200).json({                            //return response
            success:true,
            message:"Section Deleted Successfully",
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, please try again",
            error:error.message,
        });
    }
}