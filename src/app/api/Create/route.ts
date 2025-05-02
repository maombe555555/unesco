import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";
export async function POST(request: Request) {
  await dbConnect();
  const { name, email, phone, password, role } = await request.json();

  try {
    const newCreate = new User({
      name,
      email,
      phone,
      password,
      role,
    });
    await newCreate.save();
    return NextResponse.json({ message: "Create saved successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save Create." }, { status: 500 });
  }
}
export async function GET(request: Request) {
  await dbConnect();
  try {
    const Creates = await User.find({});
    return NextResponse.json(Creates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Creates." }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const deletedCreate = await User.findByIdAndDelete(id);
    if (!deletedCreate) {
      return NextResponse.json({ error: "Create not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Create deleted successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete Create." }, { status: 500 });
  }
}