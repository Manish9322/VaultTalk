

import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending-incoming', 'pending-outgoing', 'accepted', 'declined'], required: true }
}, { _id: false });

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
    select: false, // Do not return password by default
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
  online: {
    type: Boolean,
    default: false,
  },
  connections: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  blocked: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  connectionRequests: {
    type: [connectionRequestSchema],
    default: []
  },
  lastLogin: {
    type: Date,
  },
}, { 
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id.toString(); // Ensure id is a string
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        transform: function(doc, ret) {
            ret.id = ret._id.toString(); // Ensure id is a string
            delete ret._id;
            delete ret.__v;
        }
    }
}); 

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
