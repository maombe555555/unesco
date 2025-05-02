import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true, // This should be the hashed password
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);