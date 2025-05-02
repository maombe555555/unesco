"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.endsWith("@cnru.rw")) {
      setError("Username must end with @cnru.rw");
      return;
    }
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      router.push("/Admin/Adashboard");
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <div
      className="h-screen w-full"
      style={{
        backgroundImage: "url('/image.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Navigation */}
      <nav className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="ml-0">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/vision" className="hover:underline">Vision</Link>
            <Link href="/mission" className="hover:underline">Mission</Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className='max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-3xl shadow-lg'>
        <h1 className='text-center text-xl font-bold text-blue-500'>AS ADMIN</h1>
        <form onSubmit={handleLogin} className='bg-white p-6 rounded-lg shadow-md mt-4'>
          <h2 className='text-center text-lg font-semibold mb-4'>LOGIN INTO ACCOUNT</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Username (must end with @cnru.rw)</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter your username'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter password'
              required
            />
          </div>

          <div className='flex flex-col space-y-3'>
            <button
              type="submit"
              className='bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition'
            >
              Login
            </button>
            <button type="button" className='text-blue-600 hover:underline'>Forgot Password?</button>
          </div>

          <p className='mt-4 text-center'>
            Don&apos;t have an account?{" "}
            <Link href='/Admin/Acreate' className='text-blue-600 hover:underline'>
              Create New Account
            </Link>
          </p>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-90 text-white text-center py-4 mt-10">
        <p>&copy; {new Date().getFullYear()} UNESCO Rwanda – All Rights Reserved</p>
      </footer>
    </div>
  );
}
