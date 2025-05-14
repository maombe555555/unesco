"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function ReadMore({ children, maxLength }: { children: React.ReactNode; maxLength: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = typeof children === 'string' ? children : '';

  if (typeof children !== 'string' || text.length <= maxLength) {
    return <div className="mb-4" dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const displayedText = isExpanded ? text : text.slice(0, maxLength) + '...';

  return (
    <div className="mb-4">
      <p
        className="text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: displayedText }}
      />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 hover:underline mt-1"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
}

export default function AboutUsPage() {
  const pathname = usePathname();
  const sectionsData = [
    {
      title: 'Our Foundation',
      content: `
        Established in 1976, the Rwanda National Commission for UNESCO (CNRU) serves as the primary coordinating body for Rwanda's engagement with the United Nations Educational, Scientific and Cultural Organization (UNESCO). 
        Operating under the guidance of the Ministry of Education, CNRU is mandated to facilitate the implementation of UNESCO's programs and objectives within Rwanda across its diverse fields of competence: education, science, culture, communication, and information.
      `,
    },
    {
      title: 'Our Key Objectives',
      content: `
        Our objectives are aligned with UNESCO's global agenda, tailored to address Rwanda's specific needs and aspirations:
        <ul class="list-disc list-inside text-gray-600 leading-relaxed">
          <li>Championing the adoption and implementation of UNESCO's programs throughout Rwanda.</li>
          <li>Providing expert counsel to the Government of Rwanda on matters related to UNESCO's domains.</li>
          <li>Contributing to the enhancement and strengthening of Rwanda's education systems at all levels.</li>
          <li>Facilitating the advancement of scientific inquiry, research, and innovation within the country.</li>
          <li>Actively working towards the preservation and promotion of Rwanda's rich and diverse cultural heritage.</li>
          <li>Advocating for freedom of expression and the development of a pluralistic and independent media landscape.</li>
          <li>Establishing and nurturing robust international collaborations and partnerships.</li>
        </ul>
      `,
    },
    {
      title: 'Structure and Governance',
      content: `
        CNRU operates under the purview of the Ministry of Education and is supported by an Executive Secretariat responsible for day-to-day operations. 
        Technical Committees comprising experts in UNESCO's various fields provide specialized advice and support. 
        A National Advisory Board offers strategic guidance, and collaborative networks with key stakeholders ensure effective program implementation and broad participation.
      `,
    },
    {
      title: 'Our Initiatives',
      content: `
        CNRU actively engages in a range of programs and initiatives focused on:
        <br>1. Advancing Education for Sustainable Development to foster responsible citizenship.</br>
        <br>2. Supporting Science and Innovation Programs to drive economic growth and address societal challenges.</br>
        <br>3. Promoting Cultural Heritage and Creative Industries for their intrinsic value and economic potential.</br>
        <br>4. Enhancing Media Development and Freedom of Expression as cornerstones of a democratic society.</br>
        <br>5. Mainstreaming Gender Equality and Women’s Empowerment across all our activities.</br>
        <br>6. Fostering Youth Engagement and Capacity Building to empower the next generation.</br>
      `,
    },
    {
      title: 'Our Impact',
      content: `
        Since its inception, CNRU has played a vital role in Rwanda's progress by contributing to increased access to quality education, 
        the recognition and preservation of our cultural heritage, the strengthening of scientific research capabilities, 
        and the promotion of a free and vibrant media environment.
      `,
    },
    {
      title: 'Looking Ahead',
      content: `
        While we celebrate our achievements, CNRU remains committed to addressing ongoing challenges such as securing sustainable funding and fostering stronger international partnerships. 
        Our future priorities include expanding the reach and quality of digital education, enhancing national research capacity, 
        and strengthening the mechanisms for the protection and promotion of Rwanda's cultural heritage.
      `,
    },
  ];

  const focusedSections = sectionsData.filter(section =>
    ['Our Foundation', 'Our Key Objectives', 'Structure and Governance', 'Our Initiatives', 'Our Impact', 'Looking Ahead'].includes(section.title)
  );

  return (
    <div
      className="h-full w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/abou.webp')" }}
    >
      <div className="container mx-auto p-8 bg-white bg-opacity-80 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          About the Rwanda National Commission for UNESCO (CNRU)
        </h2>

        <div className="flex flex-wrap -mr-6">
          {focusedSections.map((section, index) => (
            <div key={index} className="w-1/2 md:w-1/3 pr-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">{section.title}</h3>
              <ReadMore maxLength={100}>{section.content}</ReadMore>
            </div>
          ))}
        </div>

        <section className="mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Explore Further</h3>
          <hr className="my-4 border-t border-gray-300 w-1/3 mx-auto" />
          <div className="flex items-center justify-center space-x-6">
            <Link href="https://www.unesco.rw/" className="text-blue-600 hover:underline font-medium">
              Visit UNESCO Rwanda Website
            </Link>
            <Link href="/mission" className="text-blue-600 hover:underline font-medium">
              Our Mission
            </Link>
            <Link href="/vision" className="text-blue-600 hover:underline font-medium">
              Our Vision
            </Link>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}