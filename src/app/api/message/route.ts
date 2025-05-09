import dbConnect from "@/lib/Mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    await dbConnect();
    const messages = await Message.find({});
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    await dbConnect();
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await dbConnect();
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(deletedMessage, { status: 200 });  
  }
  catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  } 
}