import User from "@/models/User"
import dbConnect from "@/lib/Mongodb"
import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/utils/passwordUtil"
import { registerSchema } from "@/lib/validations/auth"
import { z } from "zod"
import { createEmailVerificationToken } from "@/lib/utils/token"
import { sendVerificationEmail } from "@/lib/utils/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = registerSchema.parse(body)
    const { names, email, password, phone, username } = validatedData

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

    // Create the new user with role "applicant" by default
    const newUser = new User({
      names,
      email,
      password: hashedPassword,
      phone,
      username,
      role: "applicant",
      isEmailVerified: false,
    })

    await newUser.save()

    // Generate email verification token
    const verificationToken = await createEmailVerificationToken(newUser._id)

    // Send verification email
    await sendVerificationEmail(email, verificationToken, names)

    // Return success response without sensitive data
    return NextResponse.json(
      {
        message: "Registration successful. Please check your email to verify your account.",
        user: {
          id: newUser._id,
          names: newUser.names,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          isEmailVerified: newUser.isEmailVerified,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error during registration:", error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
