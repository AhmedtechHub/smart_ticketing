const nodemailer = require('nodemailer');
const getEmailTemplate = require('../utils/emailTemplate');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a sleek, branded email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} title - The main heading for the template
 * @param {string} htmlContent - The body content for the template
 * @param {string} buttonText - Optional CTA button text
 * @param {string} buttonUrl - Optional CTA button URL
 * @param {Array} attachments - Optional attachments
 */
const sendEmail = async ({ 
  to, 
  subject, 
  title, 
  htmlContent, 
  buttonText, 
  buttonUrl, 
  attachments = [] 
}) => {
  try {
    const fullHtml = getEmailTemplate(title, htmlContent, buttonText, buttonUrl);
    
    const info = await transporter.sendMail({
      from: `"Smart Events" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html: fullHtml,
      attachments
    });
    console.log('Branded email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Service Error:', error);
    throw error;
  }
};

module.exports = { sendEmail };
