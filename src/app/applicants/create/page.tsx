"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "applicant",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: any = {};

    if (!formData.username) errors.username = "Username is required.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required.";
    if (!formData.phone) errors.phone = "Phone number is required.";
    if (!formData.password) errors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const response = await axios.post("/", {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      console.log("Account created:", response.data);

      // Redirect based on role
      router.push(formData.role === "admin" ? "/Admin/Acreate" : "/applicants/dashboard");
    } catch (err: any) {
      console.error("Account creation failed:", err);
      setFormErrors({
        ...errors,
        general: err.response?.data?.error || "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div
      className="h-screen w-full"
      style={{
        backgroundImage: "url('/abou.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <nav className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="ml-0">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/vision">Vision</Link>
            <Link href="/mission">Mission</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-3xl shadow-lg">
        <h1 className="text-center text-xl font-bold">CREATE NEW ACCOUNT</h1>
        {formErrors.general && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            <p>{formErrors.general}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500"
              placeholder="Enter username"
            />
            {formErrors.username && <p className="text-red-600 text-sm mt-1">{formErrors.username}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500"
              placeholder="Enter email"
            />
            {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500"
              placeholder="Enter phone number"
            />
            {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500"
              placeholder="Create a password"
            />
            {formErrors.password && <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500"
              placeholder="Re-enter password"
            />
            {formErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{formErrors.confirmPassword}</p>}
          </div>

          {/* Role Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500"
            >
              <option value="applicant">Applicant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register as {formData.role === "admin" ? "Admin" : "Applicant"}
            </button>
          </div>

          <p className="mt-4 text-center flex justify-between text-sm">
            <Link href="/applicants/login" className="text-blue-600 hover:underline">
              Login as Applicant
            </Link>
            <Link href="/Admin/Alogin" className="text-blue-600 hover:underline">
              Login as Admin
            </Link>
          </p>
        </form>
      </div>

      <footer className="bg-gray-900 text-white py-6">
        <div className="w-full max-w-screen-xl mx-auto text-center px-6">
          <p>&copy; 2025 UNESCO CNRU. All Rights Reserved.</p>
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
