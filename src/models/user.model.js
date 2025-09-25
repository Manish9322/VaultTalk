// This is a placeholder for a database model schema.
// In a real MERN stack application, you might use Mongoose like this:
/*
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
*/

// For now, this file is a placeholder.
export const UserSchema = {
    name: "string",
    email: "string",
    createdAt: "date",
};
