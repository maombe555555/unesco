const mongoose = require('mongoose');
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
// Method to generate a reset token
userSchema.methods.generateResetToken = function () {
  // Generate a token using crypto
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return token;
};
const User = mongoose.model('User', userSchema);
module.exports = User;