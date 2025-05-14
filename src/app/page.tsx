'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const messages = [
    'Welcome to the UNESCO Participation Programme',
    'Empowering Communities for a Brighter Future',
    'Your Ideas, Your Impact, Your Change',
  ];

  const [index, setIndex] = useState(0);

  // Automatically cycle through messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const images = ['/7.jpg', '/3.png', '/image.png'];
  const [isHovered, setIsHovered] = useState<null | 'proposal' | 'eligibility'>(null);

  return (
    <div className="font-sans antialiased min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-gray-900 bg-opacity-90 p-2">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div>
            <Image src="/unesco-logo.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-3">
            <Link href="/" className="hover:text-blue-400 transition duration-200">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-400 transition duration-200">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition duration-200">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-blue-900 text-white ">
        <div className="container mx-auto text-center">
          <h3 className="text-5xl font-bold mb-6">UNESCO-CNRU</h3>
          <p className="mt-4 text-xl leading-relaxed">
           Promoting Global Education, Cultural Preservation and Sustainability.
          </p>
          <div className="mt-2 flex justify-end">
  <Link href="/login" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded-xl shadow-xl transition duration-100 transform hover:scale-105">
    Apply Now
  </Link>
</div>

        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-8">
        {/* Image Slider */}
        <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-lg shadow-xl">
          <motion.div
            className="flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {images.map((image, idx) => (
              <div key={idx} className="w-full flex-shrink-0">
                <Image
                  src={image}
                  alt={`UNESCO Initiative ${idx + 1}`}
                  width={10000}
                  height={50}
                  className="object-cover w-full h-95"
                  style={{ borderRadius: '0.5rem' }}
                />
              </div>
            ))}
          </motion.div>
          {/* Image Slider Navigation */}
          <div className="relative w-full">
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${index === idx ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => setIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sliding Text Animation */}
        <motion.h2
          key={index}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold text-blue-700 mt-10"
        >
          {messages[index]}
        </motion.h2>

        {/* Brief Introduction */}
        <p className="text-gray-700 mt-6 leading-relaxed ">
          Welcome to a future driven by innovation and sustainability. Your ideas hold the power to create lasting change. Join a dynamic community of thinkers, creators,
          and Leaders. Together, we build a more responsible and impactful world.
          Every vision matters yours can inspire transformation. Collaboration sparks solutions for global Challenges. Sustainability is not just a goal, it's a movement.
          Empower others while shaping a better tomorrow. Your contribution is the key to meaningful progress. Let's turn ideas into action and make a difference!
        </p>

        {/* Horizontal Interactive Buttons for Applicants */}
        <div className="mt-12 flex flex-row space-x-6 w-full max-w-3xl mx-auto">
          <div
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition duration-300 flex-1"
            onMouseEnter={() => setIsHovered('proposal')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <h3 className="text-xl font-semibold text-green-600 mb-4">Project Proposal</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Have a groundbreaking idea? Learn how to submit your project proposal and potentially receive UNESCO support.
            </p>
            <Link href="/login" className="inline-block w-full">
              <button
                className={`bg-green-500 text-white font-bold py-3 px-6 rounded-md shadow-sm hover:bg-green-600 transition duration-200 w-full text-center text-sm ${
                  isHovered === 'proposal' ? 'transform scale-105' : ''
                }`}
              >
                Submit Proposal
              </button>
            </Link>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition duration-300 flex-1"
            onMouseEnter={() => setIsHovered('eligibility')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <h3 className="text-xl font-semibold text-yellow-600 mb-4">Eligibility & Guidelines</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Understand the criteria and guidelines for applying to the UNESCO Participation Programme. Ensure your project meets the requirements.
            </p>
            <Link href="/eligibility" className="inline-block w-full">
              <button
                className={`bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-md shadow-sm hover:bg-yellow-600 transition duration-200 w-full text-center text-sm ${
                  isHovered === 'eligibility' ? 'transform scale-105' : ''
                }`}
              >
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </main>


      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-2">
        <div className="container max-w-screen-xl mx-auto text-center px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <Image src="/unesco-logo.jpg" alt="UNESCO CNRU Footer Logo" width={60} height={80} />
              <h2 className="text-sm font-bold">UNESCO-CNRU</h2>
              <p className="text-sm">Rwanda National Commission for UNESCO</p>
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/privacy" className="hover:text-blue-400 transition duration-200">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/Services" className="hover:text-blue-400 transition duration-200">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/FAQ" className="hover:text-blue-400 transition duration-200">FAQ</Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm ">&copy; {new Date().getFullYear()} UNESCO CNRU. All Rights Reserved.</p>
          <p className="text-xs">
            Empowering Minds, Preserving Heritage, Building a Sustainable Future.
          </p>
        </div>
      </footer>
    </div>
  );
}