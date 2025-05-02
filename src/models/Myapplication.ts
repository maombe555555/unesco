import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: String,
  status: {
    type: String,
    enum: ["pending", "rejected", "accepted"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
