require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testMail() {
    try {
        console.log("Attempting test with sender:", process.env.EMAIL_USER);
        const info = await transporter.sendMail({
            from: `"Smart Test" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "Test from API - Auth User Sender",
            text: "Testing if using the authenticated user as 'from' works.",
        });
        console.log("Success with EMAIL_USER:", info.messageId);
    } catch (e) {
        console.log("Failed with EMAIL_USER:", e.message);
        
        try {
            console.log("Attempting second test with sender:", process.env.ADMIN_EMAIL);
            const info2 = await transporter.sendMail({
                from: `"Smart Test" <${process.env.ADMIN_EMAIL}>`,
                to: process.env.ADMIN_EMAIL,
                subject: "Test from API - Admin Email Sender",
                text: "Testing if the Gmail sender really fails as expected.",
            });
            console.log("Unexpected success with ADMIN_EMAIL:", info2.messageId);
        } catch (e2) {
            console.log("Failed with ADMIN_EMAIL (as expected):", e2.message);
        }
    }
}

testMail();
