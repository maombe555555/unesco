import mongoose, { Schema, Document } from "mongoose";
export interface IViewDelete extends Document {
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
const ViewDeleteSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["active", "deleted"], default: "active" },
  },
  { timestamps: true }
);
export default mongoose.models.ViewDelete || mongoose.model<IViewDelete>("ViewDelete", ViewDeleteSchema);