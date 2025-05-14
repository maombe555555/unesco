"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthCheckProps {
  role?: string
  fallbackUrl?: string
}

export function AuthCheck({ role, fallbackUrl = "/login" }: AuthCheckProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const checkAuth = async () => {
        try {
          // Use the API endpoint that leverages the session utilities
          const response = await fetch("/api/auth/check", {
            method: "GET",
            credentials: "include",
          })

          if (!response.ok) {
            router.push(fallbackUrl)
            return
          }

          const data = await response.json()

          // If role is specified, check if user has the required role
          if (role && data.role !== role) {
            if (data.role === "admin") {
              router.push("/admin")
            } else if (data.role === "applicant") {
              router.push("/applicants/dashboard")
            } else {
              router.push(fallbackUrl)
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          router.push(fallbackUrl)
        }
      }

      checkAuth()
    }
  }, [router, role, fallbackUrl])

  return null
}
