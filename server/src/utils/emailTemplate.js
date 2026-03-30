/**
 * Generates a sleek, branded HTML email template
 * @param {string} title - Header title of the email
 * @param {string} content - Main HTML content
 * @param {string} buttonText - Optional CTA button text
 * @param {string} buttonUrl - Optional CTA button URL
 */
const getEmailTemplate = (title, content, buttonText = null, buttonUrl = null) => {
  const primaryColor = '#1a1a1a'; // Approximation of oklch(0.216 0.006 56.043)
  const backgroundColor = '#ffffff';
  const mutedColor = '#666666';
  const logoUrl = 'https://res.cloudinary.com/dvkt0lsqb/image/upload/v1773771501/Smart_Ticketing_Logo_o9qzbh.png';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          color: #1a1a1a;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${backgroundColor};
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .header {
          padding: 40px 20px;
          text-align: center;
          background-color: ${backgroundColor};
        }
        .logo {
          max-width: 180px;
          margin-bottom: 20px;
        }
        .content {
          padding: 0 40px 40px;
          line-height: 1.6;
          font-size: 16px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: ${primaryColor};
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: ${primaryColor};
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 20px;
        }
        .footer {
          padding: 20px;
          text-align: center;
          background-color: #f1f1f1;
          font-size: 12px;
          color: ${mutedColor};
        }
        .divider {
          height: 1px;
          background-color: #eeeeee;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Smart Ticketing Logo" class="logo">
        </div>
        <div class="content">
          <div class="title">${title}</div>
          ${content}
          ${buttonText && buttonUrl ? `
            <div style="text-align: center;">
              <a href="${buttonUrl}" class="button">${buttonText}</a>
            </div>
          ` : ''}
          <div class="divider"></div>
          <p style="font-size: 14px; color: ${mutedColor};">
            If you have any questions, feel free to reply to this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Smart Event-Ticketing. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = getEmailTemplate;
