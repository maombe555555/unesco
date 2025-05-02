
"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
export default function Page() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setError(null); // Reset error state before submission
    // Username must end with "@cnru.rw"
    if (!username.endsWith("@cnru.rw")) {
setError("Username must end with '@cnru.rw'");
      return;
    }
    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // Send data to the server
      const response = await axios.post("/", {
        username,
        email,
        phone,
        password,
        role: "admin", // Always register as an admin
      });
      // Log server response and notify user
      console.log("Account created successfully:", response.data);
      alert("Account created successfully!");
    } catch (err: any) {
      // Log error and show user feedback
      console.error("Error creating account:", err);
      setError(err.response?.data?.error || "Failed to create account. Please try again.");
    }
  };
  return (
    <div
      className="h-screen w-full"
      style={{
        backgroundImage: "url('/abou.webp')", // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navigation */}
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
      {/* Registration Form */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-3xl shadow-lg">
        <h1 className="text-center text-xl font-bold">CREATE NEW ADMIN ACCOUNT</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register as Admin
            </button>
          </div>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link href="/Admin/Alogin" className="text-blue-600 hover:underline">
              Login as Admin
            </Link>
          </p>
        </form>
      </div>
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