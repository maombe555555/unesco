import mongoose from "mongoose";

// Define the project schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  applicantName: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    default: 0, // Default to 0 if marks are not assigned
  },
});

// Create the model from the schema
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
