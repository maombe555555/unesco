import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import Notification from "@/models/Message";
export async function GET(request: Request) {
  await dbConnect();
  try {
    const messages = await Notification.find({});
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }}
export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const deletedMessage = await Notification.findByIdAndDelete(id);
    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Message deleted successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }} 
  export async function POST(request: Request) {
    await dbConnect();
    const { username, email, message } = await request.json();
    try {
      const newMessage = new Notification({
        username,
        email,
        message,
      });
      await newMessage.save();
      return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }
  }
//     }


 
