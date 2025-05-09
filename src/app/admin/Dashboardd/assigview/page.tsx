
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
const AssignMarks = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Local state to keep updated marks
  const [marksUpdates, setMarksUpdates] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/marks");
        setProjects(response.data);
        // Initialize marksUpdates state with current marks (or default to 0)
        const initialMarks: { [key: string]: number } = {};
        response.data.forEach((project: any) => {
          initialMarks[project.id] = project.marks || 0;
        });
        setMarksUpdates(initialMarks);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
  const handleMarksChange = (id: string, value: number) => {
    setMarksUpdates((prev) => ({ ...prev, [id]: value }));
  };
  const handleSaveMarks = async (id: string) => {
    try {
      // For demo, we assume that an update of marks is performed via PUT
      const updatedMarks = marksUpdates[id];
      await axios.put(`/api/marks/${id}`, { marks: updatedMarks });
      alert("Marks updated successfully!");
      // Optionally update local projects data state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? { ...project, marks: updatedMarks } : project
        )
      );
    } catch (err: any) {
      console.error("Error updating marks:", err);
      alert("Failed to update marks. Please try again.");
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
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Assign / View Marks</h1>
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
                  <th className="py-2 px-4 border">Current Marks</th>
                  <th className="py-2 px-4 border">Assign Marks</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id}>
                    <td className="py-2 px-4 border text-center">{index + 1}</td>
                    <td className="py-2 px-4 border">{project.title}</td>
                    <td className="py-2 px-4 border">{project.applicantName}</td>
                    <td className="py-2 px-4 border text-center">
                      {project.marks !== undefined ? project.marks : "Not Assigned"}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <input
                        type="number"
                        value={marksUpdates[project.id]}
                        onChange={(e) =>
                          handleMarksChange(project.id, parseFloat(e.target.value))
                        }
                        className="w-20 p-1 border rounded text-center"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleSaveMarks(project.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Save Marks
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
export default AssignMarks;