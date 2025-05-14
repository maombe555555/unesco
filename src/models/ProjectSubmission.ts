// src/models/ProjectSubmission.js
import mongoose from 'mongoose';
const ProjectSubmissionSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  orgName: { type: String, required: true },
  orgType: { type: String, required: true },
  repName: { type: String, required: true },
  email: { type: String, required: true },
  selectedProvince: { type: String, required: true },
  selectedDistrict: { type: String, required: true },
  selectedSector: { type: String, required: true },
  selectedCell: { type: String, required: true },
  selectedVillage: { type: String, required: true },
  contactFirstName: { type: String, required: true },
  contactFamilyName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPersonIfNotLegal: { type: String },
  projectPartners: { type: String },
  projectTeamMembers: { type: String },
  projectTitle: { type: String, required: true },
  placeOfImplementation: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  projectDescription: { type: String, required: true },
  projectMainObjective: { type: String, required: true },
  specificObjectives: { type: String, required: true },
  implementationPlan: { type: String, required: true },
  targetGroups: { type: String, required: true },
  communicationPlan: { type: String, required: true },
  supportingDocuments: { type: [String] }, // Array of file paths for uploaded documents
}, { timestamps: true });
export default mongoose.models.ProjectSubmission || mongoose.model('ProjectSubmission', ProjectSubmissionSchema);