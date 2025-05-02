
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
const SubmissionSettings = () => {
  // State to hold the current submission deadline and a custom notification message.
  const [deadline, setDeadline] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  // On mount, you might want to fetch the current submission settings.
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/Setting");
        // Expected response structure: { deadline: "YYYY-MM-DD", message: "..." }
        setDeadline(response.data.deadline);
        setNotificationMessage(response.data.message);
      } catch (err: any) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);
  // Handle form submission (update deadline and send notifications)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setError("");
    try {
      // Post updated submission settings to your API.
      // The backend should update the settings and trigger email notifications to all application owner emails.
      const payload = { deadline, message: notificationMessage };
      const response = await axios.post("/api/submission-settings", payload);
      setFeedback("Settings updated successfully! Notification emails were sent to all application owners.");
    } catch (err: any) {
      console.error("Error updating submission settings:", err);
      setError("Failed to update submission settings. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
            <span className="ml-3 text-xl font-bold">UNESCO Admin</span>
          </div>
          <div className="space-x-4">
            <Link href="/Admin/Adashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/Admin/Adashboard/view" className="hover:underline">
              View Applicants
            </Link>
            <Link href="/Admin/Adashboard/viewdelete" className="hover:underline">
              Manage Projects
            </Link>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Project Submission Settings</h1>
        {feedback && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
            {feedback}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Submission Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Notification Message
            </label>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="w-full border p-2 rounded"
              rows={4}
              placeholder="Enter your message to notify every application owner..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Settings & Notify
          </button>
        </form>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 mt-10">
        <p>&copy; {new Date().getFullYear()} UNESCO CNRU. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
export default SubmissionSettings;