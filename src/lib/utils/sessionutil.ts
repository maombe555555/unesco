import { SignJWT, jwtVerify } from "jose"
import Session from "@/models/Session"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const secret = new TextEncoder().encode(secretKey)
const alg = "HS256"

export const encrypt = async (
  payload: {
    userId: string
    email: string
    names: string
    role: string
    requiresTwoFactor?: boolean
    rememberMe?: boolean
  },
  expirationTime = "2h", // Default to 2 hours
) => {
  // Ensure userId is a string
  const stringifiedPayload = {
    ...payload,
    userId: payload.userId.toString(),
  }

  return await new SignJWT(stringifiedPayload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secret)
}

export const decrypt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [alg],
    })
    return payload
  } catch (error) {
    console.error("JWT decryption failed:", error)
    return null
  }
}

export const createSession = async (
  userId: string,
  email: string,
  names: string,
  role: string,
  expirationTime = "2h", // Default to 2 hours
  requiresTwoFactor = false, // Flag for 2FA
  rememberMe = false, // Remember me flag
) => {
  try {
    // Ensure userId is a string
    const userIdStr = userId.toString()

    // Calculate expiration date based on expirationTime
    let expiresAt: Date
    if (expirationTime === "30d") {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    } else if (expirationTime === "10m") {
      expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes for 2FA
    } else {
      expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
    }

    const token = await encrypt(
      {
        userId: userIdStr,
        email,
        names,
        role,
        requiresTwoFactor,
        rememberMe,
      },
      expirationTime,
    )

    // If this is a temporary token for 2FA, don't store it in the database
    // and don't set it as a cookie
    if (requiresTwoFactor) {
      return {
        userId: userIdStr,
        email,
        names,
        role,
        token,
        expiresAt,
        requiresTwoFactor,
        rememberMe,
      }
    }

    const session = {
      userId: userIdStr,
      email,
      names,
      role,
      token,
      expiresAt,
      createdAt: new Date(),
      lastActive: new Date(),
      ipAddress: "127.0.0.1", // In a real app, get this from the request
      userAgent: "Unknown", // In a real app, get this from the request
      deviceInfo: "Unknown Device", // In a real app, parse this from user agent
    }

    // Calculate cookie max age in seconds
    const maxAge =
      expirationTime === "30d"
        ? 30 * 24 * 60 * 60 // 30 days in seconds
        : 2 * 60 * 60 // 2 hours in seconds

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge,
      sameSite: "lax" as const,
    }

    ;(await cookies()).set("session", token, cookieOptions)

    await Session.create(session)
    return session
  } catch (error) {
    console.error("Error creating session:", error)
    throw new Error("Session creation failed")
  }
}

export const verifyTempToken = async (token: string) => {
  try {
    const payload = await decrypt(token)
    if (!payload || !payload.requiresTwoFactor) {
      return null
    }
    return payload
  } catch (error) {
    console.error("Error verifying temp token:", error)
    return null
  }
}

export const getSession = async () => {
  try {
    const token = (await cookies()).get("session")?.value
    if (!token) return null
    const session = await decrypt(token)
    if (!session) return null

    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export const deleteSession = async () => {
  try {
    (await cookies()).delete("session")
    return true
  } catch (error) {
    console.error("Error deleting session:", error)
    return false
  }
}
