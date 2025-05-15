import mongoose, { Schema, type Document } from "mongoose"

// Define the Message Schema
const MessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "responded", "archived"],
      default: "pending",
    },
    adminNotes: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  },
)

// Create the Message Model
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema)

export default Message

export interface IMessage extends Document {
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  status: "pending" | "responded" | "archived"
  adminNotes?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}
