/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to list all users in the database
 *
 * Run with: node scripts/list-users.js
 */

const mongoose = require("mongoose")
require("dotenv").config()

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set")
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
  role: { type: String, enum: ["applicant", "admin"], default: "applicant" },
  isEmailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
})

// Create model
const User = mongoose.model("User", UserSchema)

// Main function to list users
async function listUsers() {
  try {
    // Find all users
    const users = await User.find({}).sort({ createdAt: -1 })

    if (users.length === 0) {
      console.log("No users found in the database")
      process.exit(0)
    }

    console.log(`Found ${users.length} users:`)
    console.log("------------------------------")

    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`)
      console.log(`- ID: ${user._id}`)
      console.log(`- Name: ${user.names}`)
      console.log(`- Username: ${user.username}`)
      console.log(`- Email: ${user.email}`)
      console.log(`- Role: ${user.role}`)
      console.log(`- Email Verified: ${user.isEmailVerified ? "Yes" : "No"}`)
      console.log(`- 2FA Enabled: ${user.twoFactorEnabled ? "Yes" : "No"}`)
      console.log(`- Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : "Unknown"}`)
      console.log("------------------------------")
    })

    process.exit(0)
  } catch (error) {
    console.error("Error listing users:", error)
    process.exit(1)
  }
}

// Run the script
listUsers().catch((err) => {
  console.error("Script failed:", err)
  process.exit(1)
})
