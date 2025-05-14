import mongoose, { Schema, type Document } from "mongoose"

export interface IVerificationToken extends Document {
  userId: string
  token: string
  type: "email" | "password"
  expires: Date
  createdAt: Date
  updatedAt: Date
}

const VerificationTokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    type: { type: String, enum: ["email", "password"], required: true },
    expires: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
)

// Create index for faster queries and automatic expiration
VerificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })
VerificationTokenSchema.index({ token: 1 }, { unique: true })

const VerificationToken =
  mongoose.models.VerificationToken || mongoose.model("VerificationToken", VerificationTokenSchema)

export default VerificationToken
