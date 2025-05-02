
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
export default function ApplicantDashboard() {
  const pathname = usePathname();
  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="ml-0">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-4">
            <Link
              href="/"
              className={pathname === '/' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={pathname === '/about' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={pathname === '/contact' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}
            >
              Contact
            </Link>
            <Link
              href="/vision"
              className={pathname === '/vision' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}
            >
              Vision
            </Link>
            <Link
              href="/mission"
              className={pathname === '/mission' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}
            >
              Mission
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="flex flex-1 mt-8 gap-4 p-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Dashboard</h3>
          <nav className="space-y-4">
            <Link href="/applicant/dashboard" className="block hover:text-gray-400">Home</Link>
            <Link href="/applicants/Myapplication" className="block hover:text-gray-400">My Applications</Link>
            <Link href="/applicants/combinedform" className="block hover:text-gray-400">New Application</Link>
            <Link href="/applicant/Edit" className="block hover:text-gray-400">Edit Profile</Link>
            <Link href="/logout" className="block hover:text-gray-400">Logout</Link>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 bg-white p-6 rounded-lg shadow-md">
          {/* New Application Section */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4 text-gray-800">My Applications</h2>
              <Link 
                href="/applicants/combinedform" 
                className="bg-blue-500 text-white font-medium py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-300"
              >
                Create New Application
              </Link>
            </div>
            <ul className="space-y-3">
              <li className="bg-green-100 text-green-800 p-3 rounded-md">Application 1: Approved</li>
              <li className="bg-yellow-100 text-yellow-800 p-3 rounded-md">Application 2: Pending Review</li>
              <li className="bg-red-100 text-red-800 p-3 rounded-md">
                Application 3: Rejected - Missing details
              </li>
            </ul>
          </section>
          
          {/* Notification Settings */}
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Notifications</h2>
            <p className="text-gray-700">
              Receive all updates about your application status via email.
            </p>
            <button className="bg-blue-500 text-white font-medium py-2 px-4 mt-2 rounded shadow hover:bg-blue-700 transition duration-300">
              Enable Email Notifications
            </button>
          </section>
          
          {/* Edit Profile Section */}
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Profile</h2>
            <p className="text-gray-700 mb-2">
              Update your details like contact information and password.
            </p>
            <Link 
              href="/applicant/profile" 
              className="bg-green-500 text-white font-medium py-2 px-4 rounded shadow hover:bg-green-700 transition duration-300"
            >
              Edit Profile
            </Link>
          </section>
        </main>
      </div>
      
      <footer className="bg-gray-900 text-white py-6">
        <div className="w-full max-w-screen-xl mx-auto text-center px-6">
          <p>&copy; 2025 UNESCO CNRU. All Rights Reserved.</p>
          {/* Vision Link */}
          <div className="mt-4">
            <p className="text-sm">
              <a
                href="https://www.unesco.org/en/vision"
                target="_blank"
                className="text-blue-400 hover:text-blue-600"
              >
                Learn more about the Vision of UNESCO CNRU
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}