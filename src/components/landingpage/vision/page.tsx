"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();

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
      
      {/* Header */}
      <header className="bg-blue-900 text-white py-8">
        <div className="w-full max-w-screen-xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold">UNESCO CNRU Vision</h1>
          <p className="mt-4 text-lg">
            Promoting Global Education, Cultural Preservation, and Sustainability
          </p>
        </div>
        
      </header>

      {/* Main Content - 5 Vertical Columns */}
      <div className="w-full max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-12">
          {[
            { title: "Educational Advancement", text: "UNESCO CNRU promotes global educational development, focusing on enhancing standards, promoting equity, and supporting lifelong learning worldwide." },
            { title: "Cultural Preservation", text: "UNESCO CNRU is committed to preserving cultural heritage, ensuring that unique traditions, languages, and historic landmarks are safeguarded for future generations." },
            { title: "Sustainability & Peace", text: "The organization advocates for sustainability and peace, encouraging global cooperation and fostering dialogue to build a more harmonious and sustainable world." },
            { title: "Research & Innovation", text: "UNESCO CNRU promotes research and innovation in various fields, enabling scientific breakthroughs and fostering the exchange of knowledge across borders." },
            { title: "Community Engagement", text: "The organization is dedicated to fostering community involvement through education and cultural programs, promoting inclusivity and empowerment at the local level." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-900">{item.title}</h3>
              <p className="mt-4 text-gray-600">{item.text}</p>
            </div>
          ))}
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
