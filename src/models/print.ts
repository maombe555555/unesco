import mongoose, { Document, Schema } from 'mongoose';

interface MarksBreakdown {
  criteria: string;
  marks: number;
}

interface Application extends Document {
  applicantName: string;
  projectTitle: string;
  submissionDate: string;
  marks: number;
  marksBreakdown: MarksBreakdown[];
}

const MarksBreakdownSchema: Schema = new Schema({
  criteria: { type: String, required: true },
  marks: { type: Number, required: true },
});

const ApplicationSchema: Schema = new Schema(
  {
    applicantName: { type: String, required: true },
    projectTitle: { type: String, required: true },
    submissionDate: { type: String, required: true },
    marks: { type: Number, required: true },
    marksBreakdown: [MarksBreakdownSchema],
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = mongoose.models.Application || mongoose.model<Application>('Application', ApplicationSchema);

export default ApplicationModel;
