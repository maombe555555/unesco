"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { loginSchema } from "@/lib/validations/auth"
import type { z } from "zod"
import toast from "react-hot-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/UI/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type LoginFormInputs = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleLogin = async (data: LoginFormInputs) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          rememberMe,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed")
      }

      toast.success("Login successful!")

      const { role } = responseData.session

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/applicants/dashboard")
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during login")
      toast.error(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* UNESCO Logo */}
        <div className="flex justify-center mb-2 ">
          <div className="bg-[#0077D4] rounded-full">
            <Image
              src="/unesco-logo.jpg"
              alt="UNESCO Logo"
              width={40}
              height={40}
              className="text-white w-18 h-14"
            />
          </div>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#0077D4]">
              UNESCO Participation Programme
            </CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(handleLogin)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-[#0077D4] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col mt-4 space-y-4">
              <Button type="submit" className="w-full bg-[#0077D4] hover:bg-[#005ea6]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-[#0077D4] hover:underline">
                  Create an account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
