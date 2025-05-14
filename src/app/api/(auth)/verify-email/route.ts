import { NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { verifyToken, deleteToken } from "@/lib/utils/token"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 })
    }

    await dbConnect()

    // Verify the token
    const verificationToken = await verifyToken(token, "email")

    if (!verificationToken) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    // Update user's email verification status
    const user = await User.findById(verificationToken.userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // If already verified, just return success
    if (user.isEmailVerified) {
      return NextResponse.json({ message: "Email already verified" })
    }

    // Update user
    user.isEmailVerified = true
    await user.save()

    // Delete the token as it's been used
    await deleteToken(verificationToken._id)

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
