import OTPVerification from "@/models/OTPVerification"

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store OTP in the database
 */
export async function storeOTP(userId: string, otp: string): Promise<void> {
  // Set expiration time to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  // Delete any existing OTPs for this user
  await OTPVerification.deleteMany({ userId })

  // Create new OTP record
  await OTPVerification.create({
    userId,
    otp,
    expiresAt,
    createdAt: new Date(),
  })
}

/**
 * Verify OTP
 */
export async function verifyOTP(userId: string, otp: string): Promise<boolean> {
  const otpRecord = await OTPVerification.findOne({
    userId,
    otp,
    expiresAt: { $gt: new Date() },
  })

  if (!otpRecord) {
    return false
  }

  // Delete the OTP record to prevent reuse
  await OTPVerification.deleteOne({ _id: otpRecord._id })

  return true
}
