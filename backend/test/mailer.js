import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     
    pass: process.env.EMAIL_PASS     
  }
});

export const sendRegistrationEmail = async (to, eventName) => {
  const mailOptions = {
    from: `"Eventify" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `Registration Confirmed: ${eventName}`,
    html: `<h2>You're registered!</h2><p>Thank you for registering for <strong>${eventName}</strong>.</p>`
  };

  await transporter.sendMail(mailOptions);
};