const nodemailer = require("nodemailer");

const transporter = nodemailer.createTestAccount({

    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


//Function to send the email
const sendEmail = async(to, subject , text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendEmail(mailOptions);
        console.log("Email Sent Successfully.");
    } catch (error) {
        console.log("Failed to send Email.", error);
    }
};

module.exports = { sendEmail };