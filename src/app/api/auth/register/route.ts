import { NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { hashPassword } from "@/lib/utils/passwordUtil"
import { generateVerificationToken } from "@/lib/utils/tokenUtil"
import { sendVerificationEmail } from "@/lib/email/nodemailer"
import { registerSchema } from "@/lib/validations/auth"


export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the data
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ message: "Validation error", errors: validationResult.error.errors }, { status: 400 })
    }

    const { names, email, password, phone, username } = validationResult.data

    // Connect to the database
    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: "Email already in use" }, { status: 409 })
      }
      if (existingUser.username === username) {
        return NextResponse.json({ message: "Username already taken" }, { status: 409 })
      }
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = generateVerificationToken()

    // Create new user
    const newUser = new User({
      names,
      email,
      password: hashedPassword,
      phone,
      username,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })

    await newUser.save()

    // Send verification email
    await sendVerificationEmail(email, names, verificationToken)

    return NextResponse.json(
      {
        message: "Registration successful. Please check your email to verify your account.",
        user: {
          id: newUser._id,
          names: newUser.names,
          email: newUser.email,
          username: newUser.username,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error during registration:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}
