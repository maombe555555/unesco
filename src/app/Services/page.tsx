'use client';

import Link from 'next/link';
import { useState } from 'react';

const TermsOfServicePage = () => {
  const [showUseWebsiteMore, setShowUseWebsiteMore] = useState(false);
  const [showApplicationMore, setShowApplicationMore] = useState(false);
  const [showIPMore, setShowIPMore] = useState(false);
  const [showAccountMore, setShowAccountMore] = useState(false);
  const [showDisclaimerMore, setShowDisclaimerMore] = useState(false);
  const [showChangesMore, setShowChangesMore] = useState(false);

  return (
    <div className="container mx-auto py-10 px-4 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">UNESCO-CNRU Terms of Service</h1>

      <div className="flex flex-wrap -mx-4 mb-8">
        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Using Our Website</h2>
            <p className="text-gray-700 mb-2">
              By accessing and using the UNESCO-CNRU website, you agree to comply with these terms and all applicable laws and regulations. Your responsible use helps maintain a positive environment for everyone.
              {!showUseWebsiteMore && (
                <button onClick={() => setShowUseWebsiteMore(true)} className="text-blue-500 hover:underline mt-2 self-start">Learn More</button>
              )}
            </p>
            {showUseWebsiteMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  You are prohibited from engaging in any activity that could disrupt or interfere with the functionality of the website, including but not limited to the transmission of viruses, malware, or any other harmful code. Attempting to gain unauthorized access to any portion of the website, its servers, or related systems is strictly forbidden. User-generated content, if any, must be respectful, lawful, and not infringe upon the rights of others.
                </p>
                <button onClick={() => setShowUseWebsiteMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Submitting Your Project Application</h2>
            <p className="text-gray-700 mb-2">
              When you submit a project application through our platform, you are responsible for ensuring the accuracy and completeness of all information provided. Misleading or false information may result in the rejection of your application.
              {!showApplicationMore && (
                <button onClick={() => setShowApplicationMore(true)} className="text-blue-500 hover:underline mt-2 self-start">More Details</button>
              )}
            </p>
            {showApplicationMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  UNESCO-CNRU reserves the right to reject any application that does not adhere to the specified guidelines or is deemed incomplete. The submission of a project application does not guarantee funding or support. All applications will undergo a review process based on established criteria. By submitting an application, you grant UNESCO-CNRU the right to review, process, and retain the submitted information for evaluation and record-keeping purposes.
                </p>
                <button onClick={() => setShowApplicationMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Website Content and Intellectual Property</h2>
            <p className="text-gray-700 mb-2">
              All content on this website, including text, graphics, logos, and software, is the property of UNESCO-CNRU or its licensors and is protected by intellectual property laws.
              {!showIPMore && (
                <button onClick={() => setShowIPMore(true)} className="text-blue-500 hover:underline mt-2 self-start">Understand More</button>
              )}
            </p>
            {showIPMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  You are granted a limited, non-exclusive, and non-transferable license to access and use the website content for informational purposes related to UNESCO-CNRU's activities. Reproduction, modification, distribution, or any other use of the content without prior written permission from UNESCO-CNRU is strictly prohibited. You agree not to remove, alter, or obscure any copyright, trademark, service mark, or other proprietary rights notices incorporated in or accompanying the website content.
                </p>
                <button onClick={() => setShowIPMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">User Accounts (if applicable)</h2>
            <p className="text-gray-700 mb-2">
              If you create an account on our website, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              {!showAccountMore && (
                <button onClick={() => setShowAccountMore(true)} className="text-blue-500 hover:underline mt-2 self-start">Read More</button>
              )}
            </p>
            {showAccountMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You must notify us immediately of any unauthorized use of your account or any other breach of security. UNESCO-CNRU reserves the right to suspend or terminate your account at any time for any reason, including but not limited to a violation of these Terms of Service.
                </p>
                <button onClick={() => setShowAccountMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Disclaimer of Warranties and Limitation of Liability</h2>
            <p className="text-gray-700 mb-2">
              The UNESCO-CNRU website and its content are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied.
              {!showDisclaimerMore && (
                <button onClick={() => setShowDisclaimerMore(true)} className="text-blue-500 hover:underline mt-2 self-start">View Full Disclaimer</button>
              )}
            </p>
            {showDisclaimerMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  UNESCO-CNRU does not warrant that the website will be uninterrupted or error-free, that defects will be corrected, or that the website or the servers that make it available are free of viruses or other harmful components. To the fullest extent permitted by applicable law, UNESCO-CNRU shall not be liable for any indirect, incidental, special, consequential, or punitive damages (including, without limitation, damages for loss of profits, data, use, goodwill, or other intangible losses) arising out of or relating to your access to or use of, or your inability to access or use, the website.
                </p>
                <button onClick={() => setShowDisclaimerMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
          <div className="p-6 rounded-md shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Changes to These Terms</h2>
            <p className="text-gray-700 mb-2">
              UNESCO-CNRU reserves the right to modify or revise these Terms of Service at any time without prior notice.
              {!showChangesMore && (
                <button onClick={() => setShowChangesMore(true)} className="text-blue-500 hover:underline mt-2 self-start">See Change Policy</button>
              )}
            </p>
            {showChangesMore && (
              <div className="mt-2">
                <p className="text-gray-700 mb-2">
                  Any changes to these Terms will be effective immediately upon posting on this website. Your continued use of the website after the posting of any revised Terms constitutes your acceptance of such changes. It is your responsibility to review these Terms periodically for updates. We may, but are not obligated to, provide notice of significant changes through other means, such as email.
                </p>
                <button onClick={() => setShowChangesMore(false)} className="text-blue-500 hover:underline self-start">Show Less</button>
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

export default TermsOfServicePage;