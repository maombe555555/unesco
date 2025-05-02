'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
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
          <Link href="/" className="hover:text-blue">Home</Link>
          <Link href="/about" className="hover:text-blue">About</Link>
          <Link href="/contact" className="hover:text-blue">Contact</Link>
          <Link href="/vision" className="hover:text-blue">Vision</Link>
          <Link href="/mission" className="hover:text-blue">Mission</Link>
        </div>
      </div>
    </nav>
    
    

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center ">
        {/* Image Slider */}
        <div className="flex justify-center w-full mt-0 overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [50, 0] }} // Slide from right (300px) to center (0px)
            transition={{
              repeat: Infinity,
              duration: 5, // Time for each image to transition
              ease: 'easeInOut',
              times: [0, 1], // Each image starts and ends at its center
            }}
          >
            {images.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ x: 100 }} // Starts from the right side of the screen
                animate={{ x: 0 }} // Moves to the center of the div
                transition={{
                  delay: idx * 5, // Delay increases for each image (5s between each)
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
               className="flex items-center justify-center space-x-2 bg-white p-2 rounded-lg shadow-lg">
       
        <Image
          key={idx}
          src={image}
          alt={`Image ${idx + 1}`}
          width={100}
          height={0}
          className="rounded-2xl shadow-md w-[30vw] h-auto"
        />
    
    
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sliding Text Animation */}
        <motion.h1
          key={index}
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20}}
          transition={{ duration: 1 }}
          className="text-2xl font-bold text-blue-600 mt-2 sm:text-2xl "
        >
          {messages[index]}
        </motion.h1>

        {/* Description */}
        <p className=" text-gray-700 mt-2 leading-relaxed sm:text-lg md:text-xl">
        Welcome! This is your chance to make a real difference and contribute to a sustainable future. Join a community of innovators and inspire change. Your vision has the power to create meaningful impact!
        </p>

        {/* Start Button */}
        <div className="mt-2 flex justify -end">
          <Link href="/applicants/login">
            <button className="bg-blue-500 text-white font-bold py-2 px-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-100 mb-4 flex justify -end">
              GET STARTED
            </button>
          </Link>
        </div>
      </main>

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
