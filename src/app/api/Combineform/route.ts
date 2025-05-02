import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import Combinedform from "@/models/Combinedform";
export async function POST(request: Request) {
  await dbConnect();
  const {
    category1Explanation,
    category1Cost,
    category2Explanation,
    category2Cost,
    category3Explanation,
    category3Cost,
    totalCost,
  } = await request.json();

  try {
    const newBudget = new Combinedform({
      category1Explanation,
      category1Cost,
      category2Explanation,
      category2Cost,
      category3Explanation,
      category3Cost,
      totalCost,
    });
    await newBudget.save();
    return NextResponse.json({ message: "Budget saved successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save budget." }, { status: 500 });
  }
}
export async function GET(request: Request) {
  await dbConnect();
  try {
    const budgets = await Combinedform.find({});
    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets." }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const deletedBudget = await Combinedform.findByIdAndDelete(id);
    if (!deletedBudget) {
      return NextResponse.json({ error: "Budget not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Budget deleted successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete budget." }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  await dbConnect();
  const { id, ...updateData } = await request.json();
  try {
    const updatedBudget = await Combinedform.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Budget updated successfully!", budget: updatedBudget }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update budget." }, { status: 500 });
  }
}
// This code defines a Next.js API route for handling budget-related operations.