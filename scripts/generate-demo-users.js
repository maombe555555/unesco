/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to generate sample users for demonstration
 *
 * Run with: node scripts/generate-demo-users.js
 */

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// MongoDB connection string from environment variables
const MONGODB_URI = "mongodb://localhost:27017/unesco"

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
  password: { type: String, required: true },
  role: { type: String, enum: ["applicant", "admin"], default: "applicant" },
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpiry: { type: Date },
  avatarUrl: { type: String },
  bio: { type: String },
  organization: { type: String },
  position: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Define Activity Log Schema
const ActivityLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  details: { type: String },
})

// Create models
const User = mongoose.model("User", UserSchema)
const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema)

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Generate sample activity logs
async function generateActivityLogs(userId, userCreatedAt) {
  const actions = ["login", "profile_update", "password_change", "email_verification", "2fa_enabled", "login", "login"]

  const now = new Date()
  const logs = []

  // Create activity logs with timestamps between user creation and now
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]

    // Calculate a random timestamp between user creation and now
    const creationTime = userCreatedAt.getTime()
    const currentTime = now.getTime()
    const randomTime = creationTime + Math.random() * (currentTime - creationTime)
    const timestamp = new Date(randomTime)

    logs.push({
      userId,
      action,
      ipAddress: "127.0.0.1",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      timestamp,
      details: `Sample ${action.replace("_", " ")} activity`,
    })
  }

  // Sort logs by timestamp
  logs.sort((a, b) => a.timestamp - b.timestamp)

  // Save all logs
  return ActivityLog.insertMany(logs)
}

// Main function to create sample users
async function createSampleUsers() {
  try {
    // Check if users already exist
    const existingUsers = await User.find({
      $or: [{ email: "admin@example.com" }, { email: "user@example.com" }],
    })

    if (existingUsers.length > 0) {
      console.log("Sample users already exist. Deleting them first...")
      await User.deleteMany({
        $or: [{ email: "admin@example.com" }, { email: "user@example.com" }],
      })

      // Also delete their activity logs
      for (const user of existingUsers) {
        await ActivityLog.deleteMany({ userId: user._id.toString() })
      }
    }

    // Create admin user
    const adminPassword = await hashPassword("Admin@123")
    const adminUser = new User({
      names: "Admin User",
      username: "admin",
      email: "admin@example.com",
      phone: "+1234567890",
      password: adminPassword,
      role: "admin",
      isEmailVerified: true,
      bio: "Administrator account for the UNESCO Participation Programme",
      organization: "UNESCO",
      position: "System Administrator",
      twoFactorEnabled: true, // Admin has 2FA enabled
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date(),
    })

    // Create regular user
    const userPassword = await hashPassword("User@123")
    const regularUser = new User({
      names: "John Doe",
      username: "johndoe",
      email: "user@example.com",
      phone: "+9876543210",
      password: userPassword,
      role: "applicant",
      isEmailVerified: true,
      bio: "Regular applicant account for testing",
      organization: "Test Organization",
      position: "Project Manager",
      twoFactorEnabled: false, // Regular user has 2FA disabled
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      updatedAt: new Date(),
    })

    // Save users
    const savedAdmin = await adminUser.save()
    const savedUser = await regularUser.save()

    console.log("Sample users created successfully:")
    console.log("Admin User:")
    console.log(`- Email: admin@example.com`)
    console.log(`- Password: Admin@123`)
    console.log(`- 2FA Enabled: Yes`)
    console.log("\nRegular User:")
    console.log(`- Email: user@example.com`)
    console.log(`- Password: User@123`)
    console.log(`- 2FA Enabled: No`)

    // Generate activity logs for both users
    await generateActivityLogs(savedAdmin._id.toString(), savedAdmin.createdAt)
    await generateActivityLogs(savedUser._id.toString(), savedUser.createdAt)

    console.log("\nSample activity logs created for both users")
    console.log("\nNote: Since the admin user has 2FA enabled, you will need to")
    console.log("temporarily disable it in the database for demo purposes,")
    console.log("or implement a way to bypass it in development mode.")

    return { admin: savedAdmin, user: savedUser }
  } catch (error) {
    console.error("Error creating sample users:", error)
    throw error
  }
}

// Run the script
createSampleUsers()
  .then(() => {
    console.log("\nScript completed successfully")
    process.exit(0)
  })
  .catch((err) => {
    console.error("Script failed:", err)
    process.exit(1)
  })
