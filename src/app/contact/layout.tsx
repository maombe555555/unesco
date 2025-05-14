import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";


import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - UNESCO CNRU',
  description: 'Contact page with name, Email, and Message',
}

export default function ContactLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <>
        <Navbar />
    
        <main>
            {children}
        </main>
        <Footer />
        </>
    );
    }