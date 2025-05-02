
'use client';
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Contact() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<string>('');
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({
          username: '',
          email: '',
          message: '',
        });
      } else {
        const data = await res.json();
        console.error('API Error:', data); // Log the detailed error returned
        setStatus(data.message || 'Error sending message.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus('Error sending message.');
    }
  };
  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center flex flex-col">
      <Head>
        <title>Contact Us - UNESCO CNRU</title>
        <meta name="description" content="Contact page with Username, Email, and Message" />
      </Head>
      {/* Header */}
      <header className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <Link href="/">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </Link>
          <nav className="space-x-4">
            <Link href="/" className={pathname === '/' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}>
              Home
            </Link>
            <Link href="/about" className={pathname === '/about' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}>
              About
            </Link>
            <Link href="/contact" className={pathname === '/contact' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}>
              Contact
            </Link>
            <Link href="/vision" className={pathname === '/vision' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}>
              Vision
            </Link>
            <Link href="/mission" className={pathname === '/mission' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}>
              Mission
            </Link>
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
          {status && <p className="mt-4 text-center font-semibold">{status}</p>}
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-90 py-6">
        <div className="max-w-6xl mx-auto text-center text-white">
          <p>&copy; 2025 UNESCO CNRU. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}