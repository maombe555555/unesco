// src\models\User.ts
import mongoose, { Schema, Document } from "mongoose";

// Define the User Schema
const UserSchema: Schema = new Schema(
  {
    names: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["applicant", "admin"], default: "applicant" },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create the User Model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
export interface IUser extends Document {
  names: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}