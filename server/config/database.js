const mongoose = require("mongoose");
require("dotenv").config();
//const DATABASE_URL = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/Study_notion_db";
 


exports.connect = () => {
    mongoose.connect( process.env.MONGODB_URL , {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error) => {
        console.log("DB Connection Failed");
         console.log(error);
         process.exit(1);
    } )
};                              