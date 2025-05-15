import mongoose, { Schema, type Document } from "mongoose"

interface IOTPVerification extends Document {
  userId: string
  otp: string
  createdAt: Date
  expiresAt: Date
}

const OTPVerificationSchema = new Schema<IOTPVerification>({
  userId: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
})

// Add index to automatically expire OTPs
OTPVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const OTPVerification =
  mongoose.models.OTPVerification || mongoose.model<IOTPVerification>("OTPVerification", OTPVerificationSchema)

export default OTPVerification
