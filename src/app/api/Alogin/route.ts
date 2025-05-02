import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import Alogin from "@/models/Alogin";
export async function POST(request: Request) {
  await dbConnect();
  const { name, email, phone, password, role } = await request.json();

  try {
    const newAlogin = new Alogin({
      name,
      email,
      phone,
      password,
      role,
    });
    await newAlogin.save();
    return NextResponse.json({ message: "Alogin saved successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save Alogin." }, { status: 500 });
  }
}
export async function GET(request: Request) {
  await dbConnect();
  try {
    const Alogins = await Alogin.find({});
    return NextResponse.json(Alogins, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Alogins." }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const deletedAlogin = await Alogin.findByIdAndDelete(id);
    if (!deletedAlogin) {
      return NextResponse.json({ error: "Alogin not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Alogin deleted successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete Alogin." }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  await dbConnect();
  const { id, ...updateData } = await request.json();
  try {
    const updatedAlogin = await Alogin.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAlogin) {
      return NextResponse.json({ error: "Alogin not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Alogin updated successfully!" }, { status: 200 });
    }
    catch (error) {
    return NextResponse.json({ error: "Failed to update Alogin." }, { status: 500 });
    }
    }