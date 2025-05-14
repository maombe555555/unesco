import mongoose, { Schema, type Document } from "mongoose"

// Define the ActivityLog Schema
const ActivityLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["login", "logout", "password_change", "profile_update", "role_change", "security_alert"],
      required: true,
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: String },
  },
  {
    timestamps: true,
  },
)

// Create the ActivityLog Model
const ActivityLog = mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema)

export default ActivityLog
export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId
  type: "login" | "logout" | "password_change" | "profile_update" | "role_change" | "security_alert"
  ipAddress: string
  userAgent: string
  details?: string
  createdAt: Date
  updatedAt: Date
}
