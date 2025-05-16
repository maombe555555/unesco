/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {Suspense} from 'react'

interface MarksBreakdownItem {
  criteria: string;
  marks: number;
}

interface ApplicationData {
  id: string;
  applicantName: string;
  projectTitle: string;
  submissionDate: string;
  marks: number;
  marksBreakdown: MarksBreakdownItem[];
}

const SheetPrint: React.FC = () => {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id");
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/api/print/${applicationId}`);
        setApplication(response.data);
      } catch (err: any) {
        console.error("Error fetching application:", err);
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    } else {
      setError("No application ID provided.");
      setLoading(false);
    }
  }, [applicationId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>No application found.</p>
      </div>
    );
  }

  return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Application Sheet Print</h1>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>

      <div className="border p-6 bg-white">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Application Details</h2>
          <p>
            <strong>Applicant Name:</strong> {application.applicantName}
          </p>
          <p>
            <strong>Project Title:</strong> {application.projectTitle}
          </p>
          <p>
            <strong>Submission Date:</strong> {application.submissionDate}
          </p>
          <p>
            <strong>Overall Marks:</strong> {application.marks} / 100
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Marks Breakdown</h3>
          <table className="min-w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Criteria</th>
                <th className="border px-4 py-2 text-left">Marks Awarded</th>
              </tr>
            </thead>
            <tbody>
              {application.marksBreakdown.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.criteria}</td>
                  <td className="border px-4 py-2">{item.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
    </Suspense>
  );
};

export default SheetPrint;
