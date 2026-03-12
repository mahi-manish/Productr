import nodemailer from 'nodemailer';
import logger from '../logger.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  logger.info(`Attempting to send OTP email using: ${process.env.EMAIL_USER}`);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Productr',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50;">Productr Verification</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for logging into Productr is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #333; padding: 10px; background: #f4f4f4; text-align: center; border-radius: 5px;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
        <p>Best regards,<br/>The Productr Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`OTP Email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email to ${email}: ${error.message}`);
    return false;
  }
};
