// src\app\admin\dashboard\application\page.tsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewApplicants: React.FC = () => {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("/api/admin/application"); // Modified API endpoint
        setApplicants(response.data);

        console.log("Fetched applicants:", response.data); // Debugging line
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch applicants.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this applicant?")) return;
    try {
      await axios.delete(`/api/applicants/${id}`); // Modified API endpoint for delete
      setApplicants((prev) => prev.filter((applicant) => applicant._id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete applicant. Please try again.");
    }
  };

  return (
    
      <main className="max-w-6xl mx-auto p-8 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">View Applicants</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">S/N</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Phone</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Project Title</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length > 0 ? (
                  applicants.map((applicant, index) => (
                    <tr key={applicant._id}>
                      <td className="py-2 px-4 border text-center">{index + 1}</td>
                      <td className="py-2 px-4 border">{applicant.name}</td>
                      <td className="py-2 px-4 border">{applicant.email}</td>
                      <td className="py-2 px-4 border">{applicant.phone}</td>
                      <td className="py-2 px-4 border">{applicant.status}</td>
                      <td className="py-2 px-4 border">{applicant.title}</td>
                      <td className="py-2 px-4 border text-center">
                        <button
                          onClick={() => handleDelete(applicant._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-2 px-4 border text-center">
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
  );
};

export default ViewApplicants;