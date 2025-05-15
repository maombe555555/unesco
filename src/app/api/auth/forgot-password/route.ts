/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { generateResetToken } from "@/lib/utils/tokenUtil"
import { sendPasswordResetEmail } from "@/lib/email/nodemailer"

const forgotPasswordSchema = z.object({
  email: z.string().min(1).email(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    await dbConnect()
    const user = await User.findOne({ email })

    // If user doesn't exist, still return success for security reasons
    if (!user) {
      return NextResponse.json(
        { message: "If your email exists in our system, you will receive a password reset link shortly" },
        { status: 200 },
      )
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    user.resetPasswordToken = resetToken
    user.resetPasswordTokenExpiry = resetTokenExpiry
    await user.save()

    // Send password reset email
    await sendPasswordResetEmail(email, user.names, resetToken)

    return NextResponse.json(
      { message: "If your email exists in our system, you will receive a password reset link shortly" },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in forgot password:", error)

    if (typeof error === "object" && error !== null && "name" in error && (error as any).name === "ZodError") {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 })
    }

    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}
