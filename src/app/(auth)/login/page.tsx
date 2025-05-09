'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from '@/lib/validations/auth';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';


type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });
    const handleLogin = async (data: LoginFormInputs) => {
        setError(null);

        const loginPromise = toast.promise(
            (async () => {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const responseData = await response.json();
                    throw new Error(responseData.message || 'Login failed');
                }

                const responseData = await response.json();
                const { role } = responseData.session;

                // Redirect based on role
                if (role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/applicants/dashboard');
                }
            })(),
            {
                loading: 'Logging in...',
                success: 'Login successful!',
                error: (err) => err.message || 'An error occurred during login',
            }
        );

        try {
            await loginPromise;
        } catch (error: any) {
            setError(error.message || 'An error occurred during login');
        }
    };

    return (
        <DefaultLayout>
            <div
                className="h-screen w-full"
                style={{
                    backgroundImage: "url('/image.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Login Box */}
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-3xl shadow-lg"
                >
                    <h1 className="text-center text-xl font-bold">LOGIN</h1>
                    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                        <h2 className="text-center text-lg font-semibold mb-4">LOGIN INTO ACCOUNT</h2>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                {...register('password')}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col space-y-3">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white text-center p-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Login
                            </button>
                            <button type="button" className="text-blue-600 hover:underline">
                                Forgot Password?
                            </button>
                        </div>
                        <p className="mt-4 text-center">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Create New Account
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
}