import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
  expiresAt: { type: Date, required: true },
  token: { type: String, required: true }
}, { timestamps: true });


const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
  
export default Session;