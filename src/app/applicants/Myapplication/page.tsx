'use client';

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

type ApplicationStatus = "pending" | "rejected" | "accepted";

const isValidStatus = (status: any): status is ApplicationStatus => {
  return ["pending", "rejected", "accepted"].includes(status?.toLowerCase());
};

export default function ApplicationStatusPage() {
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("/");
        const received = res.data.status;

        if (isValidStatus(received)) {
          setStatus(received.toLowerCase() as ApplicationStatus);
        } else {
          setStatus(null);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Error fetching status:", axiosError.message);
        setError("Failed to fetch application status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Owner Application Status</h1>

      {loading && <p>Loading your application status…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div>
          <p>
            <strong>Status:</strong> {status ?? "Unknown"}
          </p>
          <p>{renderStatusMessage()}</p>
        </div>
      )}
    </div>
  );
}

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">

