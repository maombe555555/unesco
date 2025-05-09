import mongoose, { Schema, Document } from "mongoose";
   export interface IBudgetData {
     category1Explanation: string;
     category1Cost: number;
     category2Explanation: string;
     category2Cost: number;
     category3Explanation: string;
     category3Cost: number;
     category4Explanation: string;
     category4Cost: number;
     category5Explanation: string;
     category5Cost: number;
     category6Explanation: string;
     category6Cost: number;
     totalCost: number;
   }
   export interface IApplicant extends Document {
     budgetData: IBudgetData;
     selectedFiles: string[];
     moreInfoFile: string;
     submittedAt: Date;
   }
   const BudgetDataSchema = new Schema<IBudgetData>({
     category1Explanation: { type: String, default: "" },
     category1Cost: { type: Number, default: 0 },
     category2Explanation: { type: String, default: "" },
     category2Cost: { type: Number, default: 0 },
     category3Explanation: { type: String, default: "" },
     category3Cost: { type: Number, default: 0 },
     category4Explanation: { type: String, default: "" },
     category4Cost: { type: Number, default: 0 },
     category5Explanation: { type: String, default: "" },
     category5Cost: { type: Number, default: 0 },
     category6Explanation: { type: String, default: "" },
     category6Cost: { type: Number, default: 0 },
     totalCost: { type: Number, required: true },
   });
   const ApplicantSchema = new Schema<IApplicant>({
     budgetData: { type: BudgetDataSchema, required: true },
     selectedFiles: { type: [String], default: [] },
     moreInfoFile: { type: String, default: "" },
     submittedAt: { type: Date, default: Date.now },
   });
   export default mongoose.models.Applicant ||
     mongoose.model<IApplicant>("Applicant", ApplicantSchema);