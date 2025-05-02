import mongoose, { Schema, Document, Model } from "mongoose";
export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
}
const MessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
  
export default Message;