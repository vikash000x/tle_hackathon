// server/services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});




exports.sendReminderEmail = async (toEmail, studentName) => {

  console.log("Sending reminder email to:", toEmail);
  if (!toEmail || !studentName) {
    throw new Error('Missing email or student name');
  }
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: `⏰ Get back to Codeforces!`,
    html: `<p>Hi <b>${studentName}</b>,</p>
           <p>We noticed you haven't solved any problems on Codeforces in the past 7 days.</p>
           <p>Time to sharpen those skills 💪</p>
           <p>– Student Progress Tracker Bot</p>`
  };

  await transporter.sendMail(mailOptions);
};
