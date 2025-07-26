// src\models\User.ts
import mongoose, { Schema, type Document } from "mongoose"


const UserSchema: Schema = new Schema(
  {
    names: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["applicant", "admin"], default: "applicant" },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiry: { type: Date },
    avatarUrl: { type: String },
    bio: { type: String },
    organization: { type: String },
    position: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  {
    timestamps: true,
  },
)

// Create the User Model
const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User

export interface IUser extends Document {
  names: string
  username: string
  email: string
  phone: string
  password: string
  role: string
  isEmailVerified: boolean
  verificationToken?: string
  verificationTokenExpiry?: Date
  resetPasswordToken?: string
  resetPasswordTokenExpiry?: Date
  avatarUrl?: string
  bio?: string
  organization?: string
  position?: string
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  createdAt: Date
  updatedAt: Date
}
