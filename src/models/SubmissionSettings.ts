// models/SubmissionSettings.js
import mongoose from 'mongoose';
const SubmissionSettingsSchema = new mongoose.Schema({
  deadline: { type: Date, required: true },
  message: { type: String, required: true },
});
export default mongoose.models.SubmissionSettings || mongoose.model('SubmissionSettings', SubmissionSettingsSchema);