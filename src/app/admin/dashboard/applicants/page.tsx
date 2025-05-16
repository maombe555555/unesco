/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";


const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users"); // API endpoint to fetch users
        setUsers(response.data);
        console.log("Fetched users:", response.data); // Debugging line
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  return (
    <main className="max-w-6xl mx-auto p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Users</h1>
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
                <th className="py-2 px-4 border">Username</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border text-center">{index + 1}</td>
                    <td className="py-2 px-4 border">{user.name}</td>
                    <td className="py-2 px-4 border">{user.username}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">{user.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-2 px-4 border text-center">
                    No users found.
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
export default ViewUsers;