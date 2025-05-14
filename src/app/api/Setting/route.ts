tsx
// src/app/admin/dashboard/setting/page.tsx
"use client"; // Indicate that this is a client component
import React, { useState, useEffect } from "react";
import axios from "axios";
const SubmissionSettings: React.FC = () => {
  // State to hold the current submission deadline and notification message
  const [deadline, setDeadline] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  // Fetch the current submission settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/Setting");
        // Expected response structure: { deadline: "YYYY-MM-DD", message: "..." }
        setDeadline(response.data.deadline);
        setNotificationMessage(response.data.message);
      } catch (err: any) {
        console.error("Failed to load settings:", err);
        setError("Failed to load settings.");
      }
    };
    fetchSettings();
  }, []);
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setError("");
    setLoading(true); // Set loading to true
    try {
      const payload = { deadline, message: notificationMessage };
      const response = await axios.post("/api/Setting", payload);
      setFeedback("Settings updated successfully! Notification emails were sent to all application owners.");
    } catch (err: any) {
      console.error("Error updating submission settings:", err);
      setError("Failed to update submission settings. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
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
            <label htmlFor="deadline" className="block font-medium mb-1">Submission Deadline</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="notificationMessage" className="block font-medium mb-1">Notification Message</label>
            <textarea
              id="notificationMessage"
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
            className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600"} text-white px-4 py-2 rounded hover:bg-blue-700 transition`}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Saving..." : "Save Settings & Notify"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default SubmissionSettings;