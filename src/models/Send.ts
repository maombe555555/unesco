import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Add additional fields as necessary (e.g., phone, application date)
});

const Applicant = mongoose.models.Applicant || mongoose.model('Applicant', applicantSchema);

export default Applicant;
