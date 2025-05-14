import crypto from "crypto"
import VerificationToken from "@/models/VerificationToken"
import dbConnect from "@/lib/Mongodb"

// Generate a random token
export function generateToken() {
  return crypto.randomBytes(32).toString("hex")
}

// Create a verification token for email verification
export async function createEmailVerificationToken(userId: string) {
  await dbConnect()

  // Delete any existing email verification tokens for this user
  await VerificationToken.deleteMany({
    userId,
    type: "email",
  })

  // Create a new token that expires in 24 hours
  const token = generateToken()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const verificationToken = new VerificationToken({
    userId,
    token,
    type: "email",
    expires,
  })

  await verificationToken.save()
  return token
}

// Create a password reset token
export async function createPasswordResetToken(userId: string) {
  await dbConnect()

  // Delete any existing password reset tokens for this user
  await VerificationToken.deleteMany({
    userId,
    type: "password",
  })

  // Create a new token that expires in 1 hour
  const token = generateToken()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  const resetToken = new VerificationToken({
    userId,
    token,
    type: "password",
    expires,
  })

  await resetToken.save()
  return token
}

// Verify a token
export async function verifyToken(token: string, type: "email" | "password") {
  await dbConnect()

  const verificationToken = await VerificationToken.findOne({
    token,
    type,
  })

  if (!verificationToken) {
    return null
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    await VerificationToken.deleteOne({ _id: verificationToken._id })
    return null
  }

  return verificationToken
}

// Delete a token after it's been used
export async function deleteToken(tokenId: string) {
  await dbConnect()
  await VerificationToken.deleteOne({ _id: tokenId })
}
