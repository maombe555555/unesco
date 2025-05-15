/* eslint-disable react/no-unescaped-entities */
"use client"; // Mark the file as a client component
import React, { useState } from 'react';
import Link from 'next/link';
const eligibilityDetails = [
  {
    title: 'Official Submission & UNESCO Mandate',
    shortInfo: 'Applications via National Commissions. Project aligns with UNESCO core areas.',
    longInfo: (
      <>
        <p>Submissions are exclusively accepted from UNESCO Member States via their designated National Commissions. Individuals and NGOs should collaborate with their National Commissions.</p>
        <p>Proposed projects must directly align with one or more of UNESCO's core fields of competence: Education, Natural Sciences, Social and Human Sciences, Culture, and Communication and Information.</p>
      </>
    ),
  },
  {
    title: 'UNESCO Priorities & National Ownership',
    shortInfo: 'Addresses global/regional priorities. Demonstrates local need and contribution.',
    longInfo: (
      <>
        <p>Projects should, where relevant, address UNESCO's global priorities, particularly 'Africa' and 'Gender Equality'. Alignment with regional priorities is also important.</p>
        <p>Successful projects will clearly demonstrate national ownership, address specific national or local needs, and contribute to sustainable development within the beneficiary country.</p>
      </>
    ),
  },
  {
    title: 'Realistic Scope & Clear Objectives',
    shortInfo: 'Feasible timeline/budget. SMART goals for measurable outcomes.',
    longInfo: (
      <>
        <p>The proposed activities, project timeline (typically under 12 months), and budget must be realistic, well-justified, and demonstrate cost-effectiveness.</p>
        <p>Project proposals must articulate Specific, Measurable, Achievable, Relevant, and Time-bound (SMART) objectives with clearly defined indicators for success.</p>
      </>
    ),
  },
  {
    title: 'Sustainability',
    shortInfo: 'Potential for long-term impact.',
    longInfo: (
      <p>Proposals that demonstrate a strong potential for long-term sustainability and continued positive impact beyond the project's duration will be prioritized.</p>
    ),
  },
];
const Eligibility = () => {
  const [expandedStates, setExpandedStates] = useState(Array(eligibilityDetails.length).fill(false));
  const handleExpandClick = (index: number) => {
    const newExpandedStates = [...expandedStates];
    newExpandedStates[index] = !newExpandedStates[index];
    setExpandedStates(newExpandedStates);
  };
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">Key Eligibility Requirements for UNESCO Participation Programme (2025)</h2>
      <p className="text-center mb-6">Overview of the essential criteria with options to read more.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {eligibilityDetails.map((item, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 text-left">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm mb-2">{item.shortInfo}</p>
            <button 
              className="text-blue-500 underline" 
              onClick={() => handleExpandClick(index)}>
              {expandedStates[index] ? 'Read Less' : 'Read More'}
            </button>
            {expandedStates[index] && <div className="mt-2">{item.longInfo}</div>}
          </div>
        ))}
      </div>
      {/* Footer with Buttons */}
      <div className="flex justify-between items-center mt-8">
        <Link href="/" className="border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100">
          Back to Home
        </Link>
        <Link href="/settings" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
        deadline
        </Link>
      </div>
    </div>
  );
};
export default Eligibility;