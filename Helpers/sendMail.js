const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "ridhimakapila662@gmail.com",
    pass: "gsuiuromxwcuajoj", // App password for your Gmail account
  },
});

// Define the sendMail function
async function sendMail(to, subject, text, html = '') {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'ridhimakapila662@gmail.com', // sender address
      to, // recipient address
      subject, // email subject
      text, // plain text body
      html, // HTML body (optional)
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Export sendMail function
module.exports = { sendMail };
