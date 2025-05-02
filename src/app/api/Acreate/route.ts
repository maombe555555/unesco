import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import Acreate from "@/models/Acreate";
export async function POST(request: Request) {
  await dbConnect();
  const {
    name,
    email,
    phone,
    password,
    role,
  } = await request.json();

  try {
    const newAcreate = new Acreate({
      name,
      email,
      phone,
      password,
      role,
    });
    await newAcreate.save();
    return NextResponse.json({ message: "Acreate saved successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save Acreate." }, { status: 500 });
  }
}
export async function GET(request: Request) {
  await dbConnect();
  try {
    const Acreates = await Acreate.find({});
    return NextResponse.json(Acreates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Acreates." }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const deletedAcreate = await Acreate.findByIdAndDelete(id);
    if (!deletedAcreate) {
      return NextResponse.json({ error: "Acreate not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Acreate deleted successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete Acreate." }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  await dbConnect();
  const { id, ...updateData } = await request.json();
  try {
    const updatedAcreate = await Acreate.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAcreate) {
      return NextResponse.json({ error: "Acreate not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Acreate updated successfully!" }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to update Acreate." }, { status: 500 });
        }
    }
// export async function PUT(request: Request) {
//   await dbConnect(); 