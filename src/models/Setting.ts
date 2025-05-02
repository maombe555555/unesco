import mongoose, { Schema, model, models } from "mongoose";

const SubmissionSettingSchema = new Schema({
  deadline: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const SubmissionSetting = models.SubmissionSetting || model("SubmissionSetting", SubmissionSettingSchema);

export default SubmissionSetting;
