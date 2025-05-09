
"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/layouts/DefaultLayout";
// Define the shape of a message (adjust properties to your schema)
interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
const Page: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // Fetch messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setMessages(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);
  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Contact Form Messages
        </h1>
        {loading && <p>Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && messages.length === 0 && (
          <p className="text-center">No messages found.</p>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="border rounded p-4 shadow-md bg-white"
            >
              <p>
                <span className="font-semibold">From:</span> {msg.name} (
                {msg.email})
              </p>
            
              <p>
                <span className="font-semibold">Message:</span> {msg.message}
              </p>
              <p className="text-sm text-gray-600">
                Sent on: {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};
export default Page;