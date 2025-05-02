import mongoose, { Schema, model, models } from 'mongoose';

const applicantSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    projectTitle: { type: String, required: true },
  },
  { timestamps: true }
);

const Applicant = models.Applicant || model('Applicant', applicantSchema);
export default Applicant;
export interface IApplicant extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  projectTitle: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IApplicantInput {
  name: string;
  email: string;
  phone: string;
  projectTitle: string;
}               

export interface IApplicantResponse {
  success: boolean;
  message: string;
  applicant?: IApplicant;
}