
"use client"; // Indicate that this is a client component
import React, { useState } from "react";
import axios from "axios";
const ApplicationStatus: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleFetchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const response = await axios.get(`/api/applicants/status?email=${encodeURIComponent(email)}`);
      setStatus(response.data.status);
    } catch (err: any) {
      console.error("Error fetching application status:", err);
      setError(err.response?.data?.message || "Failed to fetch application status.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Check Application Status</h1>
      <form onSubmit={handleFetchStatus} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Status"}
        </button>
      </form>
      {status && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          Application Status: {status}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};
export default ApplicationStatus;