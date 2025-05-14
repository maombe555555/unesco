// src\app\(auth)\register\page.tsx
'use client'

import { registerSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {useState, useEffect} from 'react'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function Register() {
    const pathname = usePathname()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    })

    const defaultValues = {
        names: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    }

    const handleRegister = async (data: z.infer<typeof registerSchema>) => {
        setError(null)
        setSuccess(null)

        try {
            const registerPromise = fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            })

            toast.promise(
            registerPromise,
            {
                loading: "Registering...",
                success: "User registered successfully!",
                error: "Registration failed",
            }
            )

            const response = await registerPromise

            if (!response.ok) {
            const responseData = await response.json()
            toast.error(responseData.message || "Registration failed")
            setError(responseData.message || "Registration failed")
            return
            }

            const responseData = await response.json()
            setSuccess(responseData.message || "Registration successful")
            router.push("/login")
        } catch (error) {
            setError("An error occurred during registration")
        }
    }
    useEffect(() => {
        if (pathname === "/register") {
            const token = localStorage.getItem("token")
            if (token) {
                router.push("/")
            }
        }
    }
    , [pathname, router])

    return (

            <div className="flex flex-col items-center justify-center min-h-screen py-2">
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
              

            
               
                    <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="w-centre max-w-sm bg-grey-200 p-3 rounded-lg shadow-md  border-blue-200 "
                >
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                      <h1 className="text-3xl font-bold mb-4 text-blue-500 ">Register new account </h1>
                    <div className="mb-4">

                        <label htmlFor="names" className="block text-gray-700 mb-2">
                            Names
                        </label>
                        <input
                            type="text"
                            id="names"
                            {...register("names")}
                            className={`border rounded w-full py-2 px-3 text-gray-700 ${
                                errors.names ? "border-red-500" : ""
                            }`}
                        />
                        {errors.names && (
                            <p className="text-red-500 text-xs">{errors.names.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register("username")}
                            className={`border rounded w-full py-2 px-3 text-gray-700 ${
                                errors.username ? "border-red-500" : ""
                            }`}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs">{errors.username.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className={`border rounded w-full py-2 px-3 text-gray-700 ${
                                errors.email ? "border-red-500" : ""
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            {...register("phone")}
                            className={`border rounded w-full py-2 px-3 text-gray-700 ${
                                errors.phone ? "border-red-500" : ""
                            }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs">{errors.phone.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className={`border rounded w-full py-2 px-3 text-gray-700 ${
                                errors.password ? "border-red-500" : ""
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            className={`border rounded w-full py-2 px-3 text-gray-700 ${
                                errors.confirmPassword ? "border-red-500" : ""
                            }`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Register
                    </button>
                    <p className="mt-4 text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            
                 <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
            </div>
    )
}


