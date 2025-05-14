'use client';

import Link from 'next/link';
import { useState } from 'react';

const PrivacyPolicyPage = () => {
  const [showCollectMore, setShowCollectMore] = useState(false);
  const [showUseMore, setShowUseMore] = useState(false);
  const [showShareMore, setShowShareMore] = useState(false);
  const [showYourRightsMore, setShowYourRightsMore] = useState(false);

  return (
    <div className="container mx-auto py-10 px-4 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">UNESCO-CNRU Privacy Policy</h1>

      <div className="flex flex-wrap -mx-4 mb-8">
        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
            <p className="text-gray-700 mb-2">
              This section details the types of information UNESCO-CNRU gathers when you interact with our website and services. We are committed to transparency about the data we hold.
              {!showCollectMore && (
                <button onClick={() => setShowCollectMore(true)} className="text-blue-500 hover:underline mt-2 self-start">Learn More</button>
              )}
            </p>
            {showCollectMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  This may include personal information such as your name, email address, phone number, and organizational affiliation when you register for events, subscribe to newsletters, or contact us through our forms. We also automatically collect certain technical information, such as your IP address, browser type, operating system, and browsing behavior on our site through cookies and similar technologies to improve your experience and our services.
                </p>
                <button onClick={() => setShowCollectMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
            <p className="text-gray-700 mb-2">
              Here, we describe how UNESCO-CNRU utilizes the information we collect to provide and improve our services, communicate with you effectively, and ensure the security of our platform.
              {!showUseMore && (
                <button onClick={() => setShowUseMore(true)} className="text-blue-500 hover:underline mt-2 self-start">Understand More</button>
              )}
            </p>
            {showUseMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  We use your contact details to communicate with you regarding your inquiries, event registrations, and important updates about UNESCO-CNRU initiatives. The technical information we collect helps us to analyze website traffic, personalize your experience, and diagnose technical issues. We may also use aggregated and anonymized data for research and reporting purposes to better understand the impact of our work.
                </p>
                <button onClick={() => setShowUseMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Sharing and Security of Your Information</h2>
            <p className="text-gray-700 mb-2">
              This section outlines who might have access to your information and the measures we take to protect it against unauthorized access and misuse.
              {!showShareMore && (
                <button onClick={() => setShowShareMore(true)} className="text-blue-500 hover:underline mt-2 self-start">More Details</button>
              )}
            </p>
            {showShareMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  We may share your information with trusted third-party service providers who assist us in operating our website, conducting our activities, or servicing you, such as email marketing platforms and analytics providers. These providers are contractually obligated to protect your information. We take reasonable steps, including encryption and secure storage, to safeguard your personal data. However, please be aware that no method of transmission over the internet or electronic storage is completely secure.
                </p>
                <button onClick={() => setShowShareMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-2">
              Here, we explain your rights regarding the personal information we hold about you and the choices you have concerning its use.
              {!showYourRightsMore && (
                <button onClick={() => setShowYourRightsMore(true)} className="text-blue-500 hover:underline mt-2 self-start">Explore Your Rights</button>
              )}
            </p>
            {showYourRightsMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  You have the right to access, correct, or delete your personal information. You can also object to the processing of your data, request its restriction, or ask for data portability in certain circumstances. If you have provided consent for specific processing, you have the right to withdraw that consent at any time. To exercise these rights, please contact us using the details provided on our website. We will respond to your request in accordance with applicable data protection laws.
                </p>
                <button onClick={() => setShowYourRightsMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;