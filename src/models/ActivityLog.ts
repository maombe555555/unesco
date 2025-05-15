import mongoose, { Schema, type Document } from "mongoose"

interface IActivityLog extends Document {
  userId: string
  action: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  details?: string
}

const ActivityLogSchema = new Schema<IActivityLog>({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  details: { type: String },
})

// Add TTL index to automatically delete old logs after 90 days
ActivityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema)

export default ActivityLog
