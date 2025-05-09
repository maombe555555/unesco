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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateForm = () => {
    if (!formData.username.trim()) {
      setStatus('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setStatus('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      setStatus('Message is required');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setStatus('Submitting...');
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      let responseData;
      try {
        responseData = await res.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid server response');
      }
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to send message');
      }
      setStatus('Message sent successfully!');
      setFormData({
        username: '',
        email: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      setStatus(error.message || 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center flex flex-col">
      <Head>
        <title>Contact Us - UNESCO CNRU</title>
        <meta
          name="description"
          content="Contact page with Username, Email, and Message"
        />
      </Head>
      <Header pathname={pathname} />
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
          {status && (
            <p className={`mt-4 text-center font-semibold ${
              status.includes('successfully') ? 'text-green-600' : 'text-red-600'
            }`}>
              {status}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
type HeaderProps = {
  pathname: string;
};
function Header({ pathname }: HeaderProps) {
  return (
    <header className="bg-gray-900 bg-opacity-90 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
        <Link href="/">
          <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
        </Link>
        <nav className="space-x-4">
          <Link
            href="/"
            className={pathname === '/' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={pathname === '/about' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={pathname === '/contact' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}
          >
            Contact
          </Link>
          <Link
            href="/vision"
            className={pathname === '/vision' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}
          >
            Vision
          </Link>
          <Link
            href="/mission"
            className={pathname === '/mission' ? 'text-blue-500 font-bold underline' : 'hover:text-blue-300'}
          >
            Mission
          </Link>
        </nav>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="bg-gray-900 bg-opacity-90 py-6">
      <div className="max-w-6xl mx-auto text-center text-white">
        <p>&copy; 2025 UNESCO CNRU. All Rights Reserved.</p>
      </div>
    </footer>
  );
}