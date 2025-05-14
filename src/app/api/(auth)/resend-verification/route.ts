import { NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { createEmailVerificationToken } from "@/lib/utils/token"
import { sendVerificationEmail } from "@/lib/utils/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    await dbConnect()

    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // If already verified, return early
    if (user.isEmailVerified) {
      return NextResponse.json({ message: "Email already verified" })
    }

    // Generate new verification token
    const verificationToken = await createEmailVerificationToken(user._id)

    // Send verification email
    await sendVerificationEmail(email, verificationToken, user.names)

    return NextResponse.json({
      message: "Verification email sent successfully",
    })
  } catch (error) {
    console.error("Error resending verification email:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
