/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { hashPassword } from "@/lib/utils/passwordUtil"
import { sendPasswordChangedEmail } from "@/lib/email/nodemailer"

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(6)
    .max(50)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/)
    .regex(/[@$!%*?&]/),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    await dbConnect()
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password)

    // Update user with new password and clear reset token
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpiry = undefined
    await user.save()

    // Send password changed notification email
    await sendPasswordChangedEmail(user.email, user.names)

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 })
  } catch (error) {
    console.error("Error in reset password:", error)

    if (typeof error === "object" && error !== null && "name" in error && (error as any).name === "ZodError") {
      return NextResponse.json({ message: "Invalid form data" }, { status: 400 })
    }

    return NextResponse.json({ message: "An error occurred while resetting your password" }, { status: 500 })
  }
}
