'use client';

import Link from 'next/link';
import { useState } from 'react';
import { JSX } from 'react/jsx-runtime';

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
  id: string;
}

const FAQPage = () => {
  const faqData: FAQItem[] = [
    {
      question: "Who can apply for projects?",
      answer: "Eligibility criteria vary depending on the specific project's objectives and funding sources. Typically, eligible applicants may include non-governmental organizations (NGOs), community-based organizations (CBOs), academic and research institutions, and sometimes individuals, provided they meet the requirements outlined in the respective call for proposals. Pay close attention to the geographic focus, thematic areas, and any specific registration or partnership prerequisites mentioned in the guidelines.",
      id: "eligibility",
    },
    {
      question: "How do I apply?",
      answer: "The application process is usually conducted online through a dedicated application form accessible on our website during the application period. You will typically need to create an account to access the form. The application will likely require you to provide detailed information about your organization or yourself, the project proposal (including objectives, activities, budget, and expected outcomes), supporting documents (such as registration certificates, CVs, and letters of support), and adherence to UNESCO-CNRU's ethical guidelines. Ensure you carefully review all instructions and required fields before submission.",
      id: "submission",
    },
    {
      question: "Is there a deadline?",
      answer: "Yes, each call for proposals will specify a clear deadline for submission. This deadline is strictly enforced to ensure a fair and timely review process. We strongly advise you to plan your application well in advance and submit it before the closing date and time. Late submissions will generally not be considered. The specific deadline will be prominently displayed on the project's call for proposals page on our website.",
      id: "deadline",
    },
    {
      question: "What kind of projects do you support?",
      answer: "UNESCO-CNRU supports a diverse range of projects aligned with UNESCO's mandate across its key areas of competence: Education, Natural Sciences, Social and Human Sciences, Culture, and Communication and Information. We prioritize projects that demonstrate innovation, impact, sustainability, and contribute to the achievement of the Sustainable Development Goals (SDGs). Specific themes and priorities for each call for proposals will be detailed in the respective guidelines, so it's crucial to review these carefully to ensure your project aligns with our current focus.",
      id: "supported-projects",
    },
    {
      question: "What happens after I apply?",
      answer: "Once you submit your application, it will undergo a thorough review process conducted by an evaluation committee comprised of experts in the relevant fields. The evaluation criteria will be outlined in the call for proposals and may include factors such as project relevance, feasibility, impact, budget appropriateness, and the applicant's capacity. You will be notified of the outcome of your application within the timeframe specified in the project call, usually via email. Due to the volume of applications, we appreciate your patience during this process. Feedback on unsuccessful applications may or may not be provided depending on the specific call.",
      id: "review-process",
    },
    {
      question: "Can I ask questions?",
      answer: (
        <>
          Yes, we encourage you to reach out if you have any queries regarding the
          application process or specific project calls. Please direct your
          questions via{' '}
          <Link href="/contact" className="text-blue-500 hover:underline">
            our contact page
          </Link>
          . We aim to respond to your inquiries as promptly and comprehensively as
          possible. Depending on the volume of inquiries, there might be a slight
          delay in our response time, but we will do our best to assist you. For
          general information, please also refer to the detailed guidelines and
          FAQs provided on the project's call for proposals page.
        </>
      ),
      id: "contact",
    },
  ];

  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">
        Frequently Asked Questions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqData.map((item) => (
          <div key={item.id} className="p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">{item.question}</h2>
            <p className="text-gray-700 mb-2">
              {typeof item.answer === 'string' ? (
                expandedQuestions[item.id] ? (
                  item.answer
                ) : item.answer.length > 100 ? (
                  `${item.answer.substring(0, 100)}...`
                ) : (
                  item.answer
                )
              ) : (
                expandedQuestions[item.id] ? (
                  item.answer
                ) : (
                  'Click "Read More" to see the full answer.'
                )
              )}
              <button
                onClick={() => toggleQuestion(item.id)}
                className="text-blue-500 hover:underline ml-2"
              >
                {expandedQuestions[item.id] ? 'Show Less' : 'Read More'}
              </button>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default FAQPage;