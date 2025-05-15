import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { generateVerificationToken } from "@/lib/utils/tokenUtil"
import { sendVerificationEmail } from "@/lib/email/nodemailer"

const resendSchema = z.object({
  email: z.string().min(1).email(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = resendSchema.parse(body)

    await dbConnect()
    const user = await User.findOne({ email })

    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return NextResponse.json(
        { message: "If your email exists in our system, a verification link has been sent." },
        { status: 200 },
      )
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return NextResponse.json({ message: "Your email is already verified. Please login." }, { status: 400 })
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken()

    // Update user with new token
    user.verificationToken = verificationToken
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await user.save()

    // Send verification email
    await sendVerificationEmail(email, user.names, verificationToken)

    return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error resending verification email:", error)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof error === "object" && error !== null && "name" in error && (error as any).name === "ZodError") {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 })
    }

    return NextResponse.json({ message: "An error occurred while sending the verification email" }, { status: 500 })
  }
}
