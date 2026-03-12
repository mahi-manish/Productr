import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  profileImage: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
}, {
  timestamps: true,
  collection: 'users',
});



const User = mongoose.model('User', userSchema);

export default User;
