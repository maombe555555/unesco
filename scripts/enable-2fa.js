/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to enable 2FA for a specific user
 * Useful for demo purposes
 *
 * Run with: node scripts/enable-2fa.js <email>
 * Example: node scripts/enable-2fa.js user@example.com
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
  console.error("Usage: node scripts/enable-2fa.js <email>")
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

// Main function to enable 2FA
async function enable2FA(email) {
  try {
    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    // Check if 2FA is already enabled
    if (user.twoFactorEnabled) {
      console.log(`2FA is already enabled for user ${email}`)
      process.exit(0)
    }

    // Enable 2FA
    user.twoFactorEnabled = true
    await user.save()

    console.log(`2FA has been enabled for user ${email}`)
    process.exit(0)
  } catch (error) {
    console.error("Error enabling 2FA:", error)
    process.exit(1)
  }
}

// Run the script
enable2FA(email).catch((err) => {
  console.error("Script failed:", err)
  process.exit(1)
})
