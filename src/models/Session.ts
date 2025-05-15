import mongoose, { Schema, type Document } from "mongoose"

interface ISession extends Document {
  userId: string
  email: string
  names: string
  role: string
  token: string
  expiresAt: Date
  createdAt: Date
  lastActive: Date
  ipAddress: string
  userAgent: string
  deviceInfo: string
}

const SessionSchema = new Schema<ISession>({
  userId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  names: { type: String, required: true },
  role: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  ipAddress: { type: String, default: "127.0.0.1" },
  userAgent: { type: String, default: "Unknown" },
  deviceInfo: { type: String, default: "Unknown Device" },
})

// Add index to automatically expire sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Session = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema)

export default Session
