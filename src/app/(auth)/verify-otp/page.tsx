"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Suspense } from 'react';

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Redirect if no token is provided
  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]

    // Handle paste
    if (value.length > 1) {
      const digits = value
        .split("")
        .filter((char) => /\d/.test(char))
        .slice(0, 6)
      const newOtpArray = [...otp]

      digits.forEach((digit, idx) => {
        if (idx < 6) {
          newOtpArray[idx] = digit
        }
      })

      setOtp(newOtpArray)

      // Focus on the appropriate input
      if (digits.length < 6 && inputRefs.current[digits.length]) {
        inputRefs.current[digits.length]?.focus()
      }
      return
    }

    // Handle single digit
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle OTP verification
  const verifyOTP = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otpValue,
          tempToken: token,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Invalid verification code")
        setIsLoading(false)
        return
      }

      toast.success("Verification successful!")

      // Redirect based on user role
      const { role } = result.session
      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/applicants/dashboard")
      }
    } catch (error) {
      console.error("An error occurred during verification", error)
      toast.error("An error occurred during verification")
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const resendOTP = async () => {
    if (!token) return

    setIsResending(true)

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempToken: token,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to resend verification code")
        setIsResending(false)
        return
      }

      // Reset OTP fields and timer
      setOtp(["", "", "", "", "", ""])
      setTimeLeft(600)
      toast.success("A new verification code has been sent to your email")
    } catch (error) {
        console.error("An error occurred while resending the verification code", error)
      toast.error("An error occurred while resending the verification code")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#0077D4] p-2">
            <Image
              src="/unesco-logo.jpg"
              alt="UNESCO Logo"
              width={50}
              height={50}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-center text-2xl font-bold text-blue-600">Two-Factor Authentication</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit verification code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertDescription>
                A verification code has been sent to your email. The code will expire in{" "}
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </AlertDescription>
            </Alert>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-bold"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              onClick={verifyOTP}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-2">Didn&apos;t receive the code?</p>
              <Button
                variant="outline"
                onClick={resendOTP}
                disabled={isResending || timeLeft > 540} // Allow resend after 1 minute
                className="text-blue-600"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : timeLeft > 540 ? (
                  `Resend code in ${formatTime(timeLeft - 540)}`
                ) : (
                  "Resend Code"
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" onClick={() => router.push("/login")} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    </div>
    </Suspense>

  )
}
