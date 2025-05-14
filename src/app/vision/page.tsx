"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-sans antialiased min-h-screen bg-gray-100">
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

      {/* Back to About Button */}
      <div className="text-center py-8">
        <Link href="/about" className="text-blue-600 hover:underline font-medium">
          Back to About
        </Link>
      </div>
    </div>
  );
}