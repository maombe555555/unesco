/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import User from "@/models/User"
import { forbidden } from "next/navigation"

// Import the session utility at the top of the file
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"

// Function to verify if the current user is an admin
async function verifyAdminAccess(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  // Check if the user has admin role
  if (session.role !== "admin") {
    forbidden()
  }
}

export async function GET(req: NextRequest) {
  try {
    await verifyAdminAccess(req)
    await dbConnect()

    const users = await User.find({}).sort({ createdAt: -1 }).lean()

    // Convert MongoDB documents to plain objects and ensure _id is properly serialized
    const serializedUsers = users.map((user: any) => ({
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }))

    return NextResponse.json({ users: serializedUsers }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await verifyAdminAccess(req)
    await dbConnect()

    const data = await req.json()
    const { userId, userData } = data

    if (!userId || !userData) {
      return NextResponse.json({ error: "User ID and update data are required" }, { status: 400 })
    }

    const user = await User.findByIdAndUpdate(userId, userData, { new: true })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await verifyAdminAccess(req)
    await dbConnect()

    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
