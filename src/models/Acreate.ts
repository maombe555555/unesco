import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  role: { type: String, required: true, default: "admin" }
}, { timestamps: true });
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);