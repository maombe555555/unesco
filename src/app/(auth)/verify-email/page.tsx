"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error")
        setMessage("Invalid verification link")
        return
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setStatus("success")
          setMessage(result.message)
        } else {
          setStatus("error")
          setMessage(result.message || "Verification failed")
        }
      } catch (error) {
        console.error("Error during email verification:", error)
        setStatus("error")
        setMessage("An error occurred during verification")
      }
    }

    verify()
  }, [token])

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
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-blue-600">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                <p className="text-lg">Verifying your email address...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-lg font-medium text-green-600">{message}</p>
                <p className="text-gray-600">
                  Your email has been verified successfully. You can now log in to your account.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-lg font-medium text-red-600">{message}</p>
                <p className="text-gray-600">
                  We couldn&apos;t verify your email. The verification link may be invalid or expired.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {status !== "loading" && (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/login")}>
                Go to Login
              </Button>
            )}
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
