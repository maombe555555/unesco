import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
     
      <nav className="bg-gray-900 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="ml-0">
            <Image src="/LOG.jpg" alt="UNESCO Logo" width={50} height={70} />
          </div>
          <div className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    
  )
}

export default Navbar
