'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();
  const messages = [
    'Welcome to the UNESCO Participation Programme',
    'Empowering Communities for a Brighter Future',
    'Your Ideas, Your Impact, Your Change',
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000); // Change text every 5seconds
    return () => clearInterval(interval);
  }, [messages.length]);

  const images = 
    ["/7.jpg", "/3.png", "/abou.webp"];
  
  return (
    <div className="font-sans antialiased min-h-screen bg-gray-100">
      <nav className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="ml-0">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-4">
            <Link href="/" className={pathname === '/' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}>Home</Link>
            <Link href="/about" className={pathname === '/about' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}>About</Link>
            <Link href="/contact" className={pathname === '/contact' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}>Contact</Link>
            <Link href="/vision" className={pathname === '/vision' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}>Vision</Link>
            <Link href="/mission" className={pathname === '/mission' ? 'text-blue-500 font-bold underline' : 'hover:text-blue'}>Mission</Link>
          </div>
        </div>
      </nav>

      <div className="font-sans antialiased min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-900 text-white py-12">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">UNESCO CNRU Mission</h1>
            <p className="mt-4 text-lg">Promoting Global Education, Cultural Preservation, and Sustainability</p>
          </div>
        </header>

        {/* Mission Sections */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-blue-900">Educational Advancement</h3>
              <p className="mt-4 text-gray-600">
                UNESCO CNRU aims to promote global educational development by improving learning outcomes, enhancing educational equity, and supporting lifelong learning across the globe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-blue-900">Cultural Preservation</h3>
              <p className="mt-4 text-gray-600">
                With a focus on safeguarding global cultural heritage, UNESCO CNRU ensures that unique traditions, languages, and historic landmarks are preserved for future generations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-blue-900">Sustainability and Peace</h3>
              <p className="mt-4 text-gray-600">
                UNESCO CNRU advocates for peace and sustainability by fostering cross-cultural dialogue and international cooperation, helping build a peaceful, sustainable world through education and science.
              </p>
            </div>
          </div>
        </div>

        {/* Clearer Mission Description */}
        <div className="container mx-auto px-6 py-8">
          <p className="text-lg text-gray-700">
            The UNESCO CNRU Mission is dedicated to fostering global development through three fundamental pillars:
          </p>

          <ul className="mt-4 list-inside list-disc text-gray-700 space-y-2">
            <li><strong>Promoting Quality Education:</strong> Ensuring that all individuals have access to quality education that fosters critical thinking, creativity, and lifelong learning.</li>
            <li><strong>Protecting and Preserving Cultural Heritage:</strong> Safeguarding cultural diversity, historical landmarks, languages, and traditions to ensure they are passed down to future generations.</li>
            <li><strong>Advancing Sustainability and Global Peace:</strong> Advocating for sustainable development practices that protect our environment and promote global peace and cooperation.</li>
          </ul>

          <p className="mt-6 text-lg text-gray-700">
            UNESCO CNRU aims to bridge gaps in educational opportunities, safeguard valuable cultural assets, and promote global cooperation for a sustainable future. Through collaboration with governments, local communities, and international organizations, UNESCO CNRU strives to create a more peaceful, equitable, and culturally rich world.
          </p>
        </div>
      </div>

      {/* Footer */}
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
