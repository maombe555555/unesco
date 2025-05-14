import { NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { createPasswordResetToken } from "@/lib/utils/token"
import { sendPasswordResetEmail } from "@/lib/utils/email"
import { forgotPasswordSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    await dbConnect()

    // Find the user by email
    const user = await User.findOne({ email })

    // If no user found, still return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If your email is registered, you will receive a password reset link shortly.",
      })
    }

    // Generate password reset token
    const resetToken = await createPasswordResetToken(user._id)

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken, user.names)

    return NextResponse.json({
      message: "If your email is registered, you will receive a password reset link shortly.",
    })
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
