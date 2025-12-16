const nodemailer = require('nodemailer');

// Create a reusable transporter object using Gmail SMTP + App Password
// Requires the following env vars:
// - EMAIL_USER: your Gmail address (e.g., myname@gmail.com)
// - EMAIL_PASSWORD: your 16-character Gmail App Password (no spaces)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    // Strip any spaces users might paste from Google's UI
    pass: (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, ''),
  },
});

// Verify transporter at startup and log helpful diagnostics
transporter.verify()
  .then(() => console.log('[mailer] Gmail transporter ready'))
  .catch((err) => console.error('[mailer] transporter error:', err.message));

module.exports = transporter;
