
import mongoose, { Schema, Document } from "mongoose";
export interface IBudget extends Document {
  category1Explanation: string;
  category1Cost: number;
  category2Explanation: string;
  category2Cost: number;
  category3Explanation: string;
  category3Cost: number;
  totalCost: number;
}
const BudgetSchema: Schema = new Schema({
  category1Explanation: { type: String, required: true },
  category1Cost: { type: Number, required: true },
  category2Explanation: { type: String, required: true },
  category2Cost: { type: Number, required: true },
  category3Explanation: { type: String, required: true },
  category3Cost: { type: Number, required: true },
  totalCost: { type: Number, required: true },
});
// Use existing model if it exists or create a new one
export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
// This model can be used to interact with the MongoDB collection for budget data
