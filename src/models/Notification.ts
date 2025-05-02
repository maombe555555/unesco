import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  applicant: { type: String, required: true },
  marks: { type: String, required: true },
  deadline: { type: Date, required: true },
  message: { type: String },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
export interface INotification extends mongoose.Document {
  applicant: string;
  marks: string;
  deadline: Date;
  message?: string;
  sentAt: Date;
}
export interface INotificationInput {  
    applicant: string;
    marks: string;
    deadline: Date;
    message?: string;
    }
export interface INotificationResponse {
    success: boolean;
    message: string;
    notification?: INotification;
  }