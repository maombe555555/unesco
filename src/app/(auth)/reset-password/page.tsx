
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post("/api/admin/forgot", { email });
      setMessage(response.data.message); // Assuming your API returns a message
    } catch (err: any) {
      console.error(err);
      setError("Failed to send password reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Password Reset Link"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
};
export default ForgotPassword;