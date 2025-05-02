
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
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
      <div className="flex flex-1 flex-wrap mt-8 gap-4 p-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Admin Dashboard</h3>
          <nav className="space-y-4">
            <Link href="/Admin/Adashboard/view" className="block hover:text-gray-400">
              📋 View Applicants
            </Link>
            <Link href="/Admin/Adashboard/viewdelete" className="block hover:text-gray-400">
              🗂️ View/Delete Projects
            </Link>
            <Link href="/Admin/Adashboard/assigview" className="block hover:text-gray-400">
              🧮 Assign/View Marks
            </Link>
            {/* Removed Profile & Deadlines link */}
            <Link href="/Admin/Adashboard/setting" className="block hover:text-gray-400">
              ⚙️ Settings
            </Link>
            <Link href="/Admin/Adashboard/notification" className="block hover:text-gray-400">
              🔔 Notifications
            </Link>
            <Link href="/Admin/Adashboard/profile" className="block hover:text-gray-400">
              👤 Profile Edit
            </Link>
            <Link href="/" className="block hover:text-gray-400">
              🚪 Logout
            </Link>
          </nav>
        </aside>
        {/* Main Admin Section */}
        <main className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Welcome to the UNESCO Admin Dashboard
          </h2>
          <section className="mb-6 text-gray-700">
            <p>
              This panel supports all administrative tasks for the{' '}
              <strong>UNESCO Participation Programme 2024-2025</strong>:
              reviewing applicant projects, editing data, assigning marks with explanations,
              managing notifications, and updating profile settings.
            </p>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/Admin/Adashboard/view"
              className="bg-blue-500 text-white py-4 px-6 rounded shadow hover:bg-blue-600 transition text-center"
            >
              📋 Manage Applicants
            </Link>
            <Link
              href="/Admin/Adashboard/viewdelete"
              className="bg-purple-600 text-white py-4 px-6 rounded shadow hover:bg-purple-700 transition text-center"
            >
              🗂️ View & Delete Projects
            </Link>
            <Link
              href="/Admin/Adashboard/assigview"
              className="bg-yellow-500 text-white py-4 px-6 rounded shadow hover:bg-yellow-600 transition text-center"
            >
              🧮 Assign Marks & Add Notes
            </Link>
            <Link
              href="/Admin/Adashboard/setting"
              className="bg-gray-700 text-white py-4 px-6 rounded shadow hover:bg-gray-800 transition text-center"
            >
              ⚙️ Settings
            </Link>
            <Link
              href="/Admin/Adashboard/notification"
              className="bg-pink-600 text-white py-4 px-6 rounded shadow hover:bg-pink-700 transition text-center"
            >
              🔔 Notifications
            </Link>
            <Link
              href="/Admin/Adashboard/profile"
              className="bg-green-600 text-white py-4 px-6 rounded shadow hover:bg-green-700 transition text-center"
            >
              👤 Edit Profile
            </Link>
          </div>
        </main>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="w-full max-w-screen-xl mx-auto text-center px-6">
          <p>&copy; 2025 UNESCO CNRU. All Rights Reserved.</p>
          <div className="mt-4 text-sm">
            <a
              href="https://www.unesco.org/en/vision"
              target="_blank"
              className="text-blue-400 hover:text-blue-600"
            >
              Learn more about the Vision of UNESCO CNRU
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}