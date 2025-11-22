'use client';

import Link from "next/link";
import { Cat, Sparkles, Menu, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="py-5 fixed inset-x-0 top-0 z-50 bg-gradient-to-br from-[#3d1f0f] to-[#2a1508] backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        
        {/* LOGO – CLICKABLE → HOME PAGE */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Cat className="w-8 h-8 text-white animate-pulse group-hover:text-[#847570] transition-colors" />
            <Sparkles className="w-4 h-4 text-[#847570] absolute -top-1 -right-1" />
          </div>
          <span className="text-4xl font-bold font-['Poppins'] tracking-tight text-white group-hover:text-[#847570] transition-colors">
            Meowvrick
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="flex items-center space-x-2 hover:text-[#847570] transition-all duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
            <span className="font-medium">About</span>
          </Link>
          <Link href="/acm" className="flex items-center space-x-2 hover:text-[#847570] transition-all duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
            <span className="font-medium">ACM</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4 bg-[#2a1508]/95 backdrop-blur-sm border-t border-white/10">
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 text-white hover:text-[#847570] transition-all duration-200 hover:pl-2"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
            <span className="font-medium">About</span>
          </Link>
          <Link
            href="/acm"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 text-white hover:text-[#847570] transition-all duration-200 hover:pl-2"
          >
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
            <span className="font-medium">ACM</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}