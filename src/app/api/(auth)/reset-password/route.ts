import { NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { verifyToken, deleteToken } from "@/lib/utils/token"
import { hashPassword } from "@/lib/utils/passwordUtil"
import { resetPasswordSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    // Validate password
    resetPasswordSchema.parse({ password, confirmPassword: password })

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 })
    }

    await dbConnect()

    // Verify the token
    const resetToken = await verifyToken(token, "password")

    if (!resetToken) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    // Find the user
    const user = await User.findById(resetToken.userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password)

    // Update user's password
    user.password = hashedPassword
    await user.save()

    // Delete the token as it's been used
    await deleteToken(resetToken._id)

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
