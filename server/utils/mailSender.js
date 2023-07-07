const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {                            // with the help of this function we send mail of otp;      
    try{
            let transporter = nodemailer.createTransport({                    // we send mail with the help of transporter and here MAIL_USER , MAIL_PASS contain app password of that email which send email 
                host:process.env.MAIL_HOST,                               
                auth:{
                    user: process.env.MAIL_USER,                           
                    pass: process.env.MAIL_PASS,
                }
            })

            let info = await transporter.sendMail({
                from: 'StudyNotion - by Abhikant Singh',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;