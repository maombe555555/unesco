
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
const SendEmail = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>("");
  // Fetch list of applicants to extract their emails
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("/api/applicants");
        setApplicants(response.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Extract email addresses from applicants
      const recipients = applicants.map((applicant) => applicant.email);
      await axios.post("/api/send-email", { subject, message, recipients });
      setFeedback("Email sent successfully!");
      // Clear the form fields
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("Error sending email:", err);
      setFeedback("Failed to send email. Please try again.");
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
            <Link href="/admin/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/view-applicants" className="hover:underline">
              View Applicants
            </Link>
            <Link href="/admin/manage-projects" className="hover:underline">
              Manage Projects
            </Link>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Send Email to Applicants
        </h1>
        {loading ? (
          <p className="text-center">Loading applicants...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {feedback && (
              <div className="bg-green-100 text-green-700 p-3 rounded">
                {feedback}
              </div>
            )}
            <div>
              <label className="block font-medium">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                rows={6}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Send Email
            </button>
          </form>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} UNESCO CNRU. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
export default SendEmail;