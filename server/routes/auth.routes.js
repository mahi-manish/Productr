import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import logger from '../logger.js';
import { generateId } from '../utils/utility.js';
import { sendOtpEmail } from '../utils/email.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpExpiry = () => {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10);
  return expires;
};

// @desc Register a new user and send OTP
// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { fullName, email, phoneNumber } = req.body;

  try {
    const query = [];
    if (email) query.push({ email });
    if (phoneNumber) query.push({ phoneNumber });

    if (query.length === 0) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const userExists = await User.findOne({ $or: query });

    if (userExists) {
      return res.status(409).json({ message: 'User already exists. Please login' });
    }

    const otp = generateOtp();
    const otpExpires = getOtpExpiry();

    await User.create({
      userId: generateId(),
      fullName,
      email: email || undefined,
      phoneNumber: phoneNumber || undefined,
      otp,
      otpExpires,
    });

    logger.info(`Generated otp ${otp} for user ${email || phoneNumber}`);

    if (email) {
      await sendOtpEmail(email, otp);
    }

    res.status(201).json({
      message: 'OTP sent (Development Mode)',
      otp: otp, // Simplified for you
    });
  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

// @desc Generate OTP for existing user
// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const query = [];
    if (email) query.push({ email });
    if (phoneNumber) query.push({ phoneNumber });

    if (query.length === 0) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const user = await User.findOne({ $or: query });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check and retry.' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = getOtpExpiry();
    await user.save();

    logger.info(`Generated otp ${otp} for user ${email || phoneNumber}`);

    if (email) {
      await sendOtpEmail(email, otp);
    }

    res.json({
      message: 'OTP sent (Development Mode)',
      otp: otp, // Simplified for you
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

// @desc Verify OTP
// @route POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, phoneNumber, otp } = req.body;

  try {
    const query = [];
    if (email) query.push({ email });
    if (phoneNumber) query.push({ phoneNumber });

    if (query.length === 0 || !otp) {
      return res.status(400).json({ message: 'Email/phone and OTP are required' });
    }

    const user = await User.findOne({ $or: query });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check and retry.' });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP. Please try again.' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(401).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Clear OTP upon successful validation
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      id: user.userId,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      token: generateToken(user.userId),
    });
  } catch (error) {
    logger.error(`Verify OTP error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

export default router;
