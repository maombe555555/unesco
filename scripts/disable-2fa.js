/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to disable 2FA for a specific user
 * Useful for demo purposes
 *
 * Run with: node scripts/disable-2fa.js <email>
 * Example: node scripts/disable-2fa.js admin@example.com
 */

const mongoose = require("mongoose")
require("dotenv").config()

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set")
  process.exit(1)
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error("Please provide an email address")
  console.error("Usage: node scripts/disable-2fa.js <email>")
  process.exit(1)
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
  })

// Define User Schema
const UserSchema = new mongoose.Schema({
  names: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["applicant", "admin"], default: "applicant" },
  isEmailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
})

// Create model
const User = mongoose.model("User", UserSchema)

// Main function to disable 2FA
async function disable2FA(email) {
  try {
    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    // Check if 2FA is already disabled
    if (!user.twoFactorEnabled) {
      console.log(`2FA is already disabled for user ${email}`)
      process.exit(0)
    }

    // Disable 2FA
    user.twoFactorEnabled = false
    user.twoFactorSecret = undefined
    await user.save()

    console.log(`2FA has been disabled for user ${email}`)
    process.exit(0)
  } catch (error) {
    console.error("Error disabling 2FA:", error)
    process.exit(1)
  }
}

// Run the script
disable2FA(email).catch((err) => {
  console.error("Script failed:", err)
  process.exit(1)
})
