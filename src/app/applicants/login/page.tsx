
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
  const [error, setError] = useState<string | null>(null);
const handleLogin = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setError(null);
    if (role === 'admin' && !email.endsWith('@cnru.rw')) {
      setError("Admin email must end with ''");
      return;
    }
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Login failed');
      return;
    }
      // Redirect based on role
    if (role === 'admin') {
      router.push('/Admin/Adashboard');
    } else {
      router.push('/applicants/dashboard');
    }
    } catch (error) {
      setError('An error occurred during login');
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
      {/* Navbar */}
      <nav className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="ml-0">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/vision" className="hover:underline">
              Vision
            </Link>
            <Link href="/mission" className="hover:underline">
              Mission
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Login Box */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-3xl shadow-lg">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            >
              <option value="applicant">Applicant</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              href="#"
              onClick={handleLogin}
              className="bg-blue-600 text-white text-center p-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <button type="button" className="text-blue-600 hover:underline">
              Forgot Password?
            </button>
          </div>
          <p className="mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/applicants/create" className="text-blue-600 hover:underline">
              Create New Account
            </Link>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="w-full max-w-screen-xl mx-auto text-center px-6">
          <p>&copy; 2025 UNESCO CNRU. All Rights Reserved.</p>
          {/* Vision Link */}
          <div className="mt-4">
            <p className="text-sm">
              <a
                href="https://www.unesco.org/en/vision"
                target="_blank"
                className="text-blue-400 hover:text-blue-600"
              >
                Learn more about the Vision of UNESCO CNRU
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}