"use client";
import { useState } from "react";

export default function ProfileEdit() {
    const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to update profile");
            } else {
                alert("Profile updated successfully!");
            }
        } catch (error) {
            setError("Network error, please try again later.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full px-4 py-2 border rounded" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input className="w-full px-4 py-2 border rounded" type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input className="w-full px-4 py-2 border rounded" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input className="w-full px-4 py-2 border rounded" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input className="w-full px-4 py-2 border rounded" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Save Changes</button>
            </form>
        </div>
    );
}
