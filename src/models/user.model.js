
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phone: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  avatarType: {
    type: String,
    enum: ['custom', 'placeholder'],
    default: 'placeholder',
  },
  lastLogin: {
    type: Date,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
