
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
const ManageProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/Viewdelete");
        setProjects(response.data);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    } catch (err: any) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
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
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Projects</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : projects.length === 0 ? (
          <p className="text-center">No projects found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">S/N</th>
                  <th className="py-2 px-4 border">Project Title</th>
                  <th className="py-2 px-4 border">Applicant</th>
                  <th className="py-2 px-4 border">Submission Date</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id}>
                    <td className="py-2 px-4 border text-center">{index + 1}</td>
                    <td className="py-2 px-4 border">{project.title}</td>
                    <td className="py-2 px-4 border">{project.applicantName}</td>
                    <td className="py-2 px-4 border">{project.submissionDate}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} UNESCO CNRU. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
export default ManageProjects;