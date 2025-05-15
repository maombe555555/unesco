import mongoose, { Schema, type Document } from "mongoose"

interface IProject extends Document {
  projectName: string
  orgName: string
  orgType: string
  repName: string
  email: string
  selectedProvince: string
  selectedDistrict: string
  selectedSector: string
  selectedCell: string
  selectedVillage: string
  contactFirstName: string
  contactFamilyName: string
  contactEmail: string
  contactPersonIfNotLegal?: string
  projectPartners?: string
  projectTeamMembers?: string
  projectTitle: string
  placeOfImplementation: string
  startDate: Date
  endDate: Date
  projectDescription: string
  projectMainObjective: string
  specificObjectives: string
  implementationPlan: string
  targetGroups: string
  communicationPlan: string
  supportingDocuments?: [string]
  status?: "pending" | "approved" | "rejected"
  marks?: number
  feedback?: string
}



const ProjectSchema = new Schema<IProject>({
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
  supportingDocuments: { type: [String] },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  marks: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: "",
  },
}, { timestamps: true });



export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);