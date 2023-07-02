const Tag = require("../models/tags");


//create Tag ka handler funciton
exports.createTag = async (req, res) => {
    try{
         const {name, description} = req.body;                   //fetch data
         if(!name || !description) {                           //validation
                return res.status(400).json({
                    success:false,
                    message:'All fields are required',
                })
            }

            //create entry in DB
            const tagDetails = await Tag.create({
                name:name,
                description:description,
            });
            console.log(tagDetails);
            
            return res.status(200).json({                    //return response
                success:true,
                message:"Tag Created Successfully",
            })
       }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

//getAlltags handler function

exports.showAlltags = async (req, res) => {
    try{
        const allTags = await Tag.find({}, {name:true, description:true});           //it fectch all tag which has name and description
        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};