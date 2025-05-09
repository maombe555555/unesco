
'use client';
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router"; // Adjust this import if you're using the Next.js app directory
type ApplicationStatus = "pending" | "rejected" | "accepted";
// Utility function to validate the received status
const isValidStatus = (status: unknown): status is ApplicationStatus => {
  return ["pending", "rejected", "accepted"].includes(String(status).toLowerCase());
};
// Component to render the status badge with appropriate color coding
const StatusBadge = ({ status }: { status: ApplicationStatus | null }) => {
  const badgeClass =
    status === "accepted" ? "bg-green-100 text-green-800" :
    status === "rejected" ? "bg-red-100 text-red-800" :
    "bg-yellow-100 text-yellow-800";
  return (
    <span className={`px-3 py-1 rounded-full ${badgeClass}`}>
      {status ?? "Unknown"}
    </span>
  );
};
export default function ApplicationStatusPage() {
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Function to fetch the application status from the backend
  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // Retrieve the user ID from localStorage (or context)
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setTimeout(() => {
          router.push("/[auth]/login");
        }, 2000);
        return;
      }
      const res = await axios.get(`/api/Myapplication?userId=${userId}`);
      const received = res.data.status;
      if (isValidStatus(received)) {
        setStatus(received.toLowerCase() as ApplicationStatus);
      } else {
        setStatus(null);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching status:", axiosError.message);
      if (axiosError.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => {
          router.push("/[auth]/login");
        }, 2000);
      } else {
        setError("Failed to fetch application status. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // Fetch the status when the component mounts
  useEffect(() => {
    fetchStatus();
  }, []);
  // Render a status-specific message
  const renderStatusMessage = () => {
    switch (status) {
      case "pending":
        return "Your application is currently pending review. We appreciate your patience.";
      case "rejected":
        return "We're sorry, your application has been rejected. Please review our guidelines and consider reapplying.";
      case "accepted":
        return "Congratulations! Your application has been accepted.";
      default:
        return "Unable to determine your application status at this time.";
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div>
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-400">Home</Link>
            <Link href="/about" className="hover:text-blue-400">About</Link>
            <Link href="/contact" className="hover:text-blue-400">Contact</Link>
            <Link href="/vision" className="hover:text-blue-400">Vision</Link>
            <Link href="/mission" className="hover:text-blue-400">Mission</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Application Status</h1>
        {loading && (
          <div className="text-center">
            <p className="text-gray-600">Loading your application status…</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            <p>{error}</p>
            <button
              onClick={fetchStatus}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span className="font-medium">Status:</span>
              <StatusBadge status={status} />
            </div>
            <p className="text-gray-700 p-4 bg-gray-50 rounded">
              {renderStatusMessage()}
            </p>
          </div>
        )}
        <div className="mt-6 text-center">
          <Link href="/applicants/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}