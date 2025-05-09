"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UnescoMission() {
  const pathname = usePathname();

  return (
    <div
      className="h-screen w-full"
      style={{
        backgroundImage: "url('/abou.webp')", // Replace with your image path
        backgroundSize: 'cover', // Ensures the image covers the entire page
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents repetition
      }}
    >
      {/* Main Content */}
      <div className="container mx-auto p-6 bg-white bg-opacity-70 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Rwanda National Commission for UNESCO (CNRU)</h3>
        
        <section className="mb-6">
          <h3 className="text-xl font-bold">Background and Establishment of CNRU</h3>
          <p className="mb-4">
            The Rwanda National Commission for UNESCO (CNRU) was established in 1976 to coordinate Rwanda’s participation in UNESCO’s activities and to implement its programs within the country. CNRU operates under the supervision of the Ministry of Education and is responsible for implementing UNESCO’s mandates in Rwanda across various sectors, including education, science, culture, communication, and information.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-bold">Mission of CNRU</h3>
          <p className="mb-4">
            The mission of CNRU is to promote peace, education, cultural heritage, and sustainable development by implementing UNESCO’s programs and policies within Rwanda. CNRU seeks to foster intellectual cooperation among Rwandan institutions and international bodies to achieve the country’s national development goals.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-bold">Objectives of CNRU</h3>
          <p className="mb-4">CNRU's objectives align with UNESCO's global priorities while being adapted to Rwanda’s specific needs:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Promoting UNESCO's Programs in Rwanda</li>
            <li>Advising the Government on UNESCO Matters</li>
            <li>Strengthening Education Systems</li>
            <li>Promoting Science and Research</li>
            <li>Preserving Rwanda's Cultural Heritage</li>
            <li>Encouraging Freedom of Expression and Media Development</li>
            <li>Facilitating International Collaboration</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-bold">Structure and Governance of CNRU</h3>
          <p className="mb-4">
            CNRU operates under the Ministry of Education and includes an Executive Secretariat, Technical Committees, a National Advisory Board, and Stakeholder Networks to ensure effective implementation of UNESCO programs.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-bold">Programs and Initiatives</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Education for Sustainable Development</li>
            <li>Science and Innovation Programs</li>
            <li>Cultural Heritage and Creative Industries</li>
            <li>Media Development and Freedom of Expression</li>
            <li>Gender Equality and Women’s Empowerment</li>
            <li>Youth Engagement and Capacity Building</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-bold">Achievements and Impact of CNRU</h3>
          <p className="mb-4">
            Since its establishment, CNRU has significantly contributed to Rwanda’s development through increased access to quality education, recognition of Rwanda’s cultural heritage, strengthened scientific research, and enhanced media freedom.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-bold">Challenges and Future Prospects</h3>
          <p className="mb-4">
            While CNRU has made substantial progress, challenges such as limited funding and the need for stronger international collaborations remain. Future plans include expanding digital education, strengthening research capacity, and enhancing cultural heritage protection.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-bold">Conclusion</h3>
          <p>
            CNRU plays an essential role in promoting education, science, culture, and communication in Rwanda. Aligning UNESCO’s global priorities with Rwanda’s national goals has enabled significant progress in sustainable development, and continued investment in these areas will ensure future growth and cooperation.
          </p>
          <p className="mt-4">
            <span className="text-blue-600 hover:underline">
              <Link href="https://www.unesco.rw/">
                FOR MORE INFORMATION
              </Link>
            </span>
          </p>
        </section>

        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to HOME
          </Link>
        </div>
      </div>

    </div>
  );
}
