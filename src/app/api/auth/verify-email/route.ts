import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { sendWelcomeEmail } from "@/lib/email/nodemailer"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=Invalid verification link", request.url))
    }

    await dbConnect()

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=Invalid or expired verification token", request.url))
    }

    user.isEmailVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined

    await user.save()

    // Send welcome email
    await sendWelcomeEmail(user.email, user.names)

    return NextResponse.redirect(new URL("/login?success=Email verified successfully", request.url))
  } catch (error) {
    console.error("Error during email verification:", error)
    return NextResponse.redirect(new URL("/login?error=An error occurred during verification", request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired verification token" }, { status: 400 })
    }

    user.isEmailVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined

    await user.save()

    // Send welcome email
    await sendWelcomeEmail(user.email, user.names)

    return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error during email verification:", error)
    return NextResponse.json({ success: false, message: "An error occurred during verification" }, { status: 500 })
  }
}
