"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validations/auth"
import { useForm } from "react-hook-form"

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<"loading" | "valid" | "invalid">("loading")
  const [resetComplete, setResetComplete] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenStatus("invalid")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setTokenStatus("valid")
        } else {
          setTokenStatus("invalid")
        }
      } catch (error) {
        console.error("Error verifying token:", error)
        setTokenStatus("invalid")
      }
    }

    verifyToken()
  }, [token])

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to reset password")
        setIsLoading(false)
        return
      }

      setResetComplete(true)
      toast.success("Password reset successful! You can now log in with your new password.")
    } catch (error) {
      console.error("Error resetting password:", error)
      toast.error("An error occurred while resetting your password")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenStatus === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg">Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  return (
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
            <CardTitle className="text-center text-2xl font-bold text-blue-600">Reset Password</CardTitle>
            <CardDescription className="text-center">Create a new password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            {tokenStatus === "invalid" ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium">Invalid or Expired Link</h3>
                <p className="text-sm text-gray-500">
                  The password reset link is invalid or has expired. Please request a new one.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    router.push("/forgot-password")
                  }}
                >
                  Request New Link
                </Button>
              </div>
            ) : resetComplete ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Password Reset Complete</h3>
                <p className="text-sm text-gray-500">Your password has been reset successfully.</p>
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    router.push("/login")
                  }}
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Must include uppercase, lowercase, number and special character
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
