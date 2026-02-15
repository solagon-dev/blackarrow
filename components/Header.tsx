'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L35 15L20 35L5 15L20 5Z" fill="#0A0A0A" className="group-hover:fill-arrow-gold transition-colors duration-300"/>
                <path d="M20 15L27 20L20 30L13 20L20 15Z" fill="#D4AF37"/>
              </svg>
            </div>
            <span className="font-display text-2xl font-bold text-arrow-black tracking-tight">
              BlackArrow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#coverage" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
              Coverage
            </Link>
            <Link href="#about" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
              About
            </Link>
            <Link href="#claims" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
              Claims
            </Link>
            <Link href="#contact" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
              Contact
            </Link>
            <button className="bg-arrow-black text-white px-6 py-2.5 rounded-none hover:bg-arrow-gold hover:text-arrow-black transition-all duration-300 font-medium tracking-wide">
              Get Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link href="#coverage" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
                Coverage
              </Link>
              <Link href="#about" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
                About
              </Link>
              <Link href="#claims" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
                Claims
              </Link>
              <Link href="#contact" className="text-arrow-black hover:text-arrow-gold transition-colors duration-200 font-medium">
                Contact
              </Link>
              <button className="bg-arrow-black text-white px-6 py-2.5 rounded-none hover:bg-arrow-gold hover:text-arrow-black transition-all duration-300 font-medium tracking-wide w-full">
                Get Quote
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
