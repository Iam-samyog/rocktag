"use client";

import Link from "next/link";
import { Cat } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#3d1f0f] to-[#2a1508] py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
        {/* BRAND */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Cat className="w-9 h-9 text-[#E2C3A7] drop-shadow-lg" />
            <span className="text-3xl font-bold text-white tracking-tight font-heading">
              Meowvrick
            </span>
          </div>
          <p className="text-white text-base leading-relaxed font-body">
            Tracking UTA's campus cats since 2025
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="font-heading font-bold !text-white text-lg mb-5 tracking-wide">
            Quick Links
          </h4>
          <ul className="space-y-3 text-base font-body">
            <li>
              <Link
                href="/maps"
                className="text-white/85 hover:text-[#E2C3A7] transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Maps
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white/85 hover:text-[#E2C3A7] transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/acm"
                className="text-white/85 hover:text-[#E2C3A7] transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                ACM Chapter
              </Link>
            </li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h4 className="font-heading font-bold !text-white text-lg mb-5 tracking-wide">
            Resources
          </h4>
          <ul className="space-y-3 text-base font-body">
            <li>
              <Link
                href="/privacy"
                className="text-white hover:text-[#E2C3A7] transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-white hover:text-[#E2C3A7] transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white hover:text-[#E2C3A7] transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER – FIXED & BEAUTIFUL */}
        <div>
          <h4 className="font-heading font-bold !text-white text-lg mb-5 tracking-wide">
            Stay Updated
          </h4>
          <p className="text-white/80 text-base mb-5 leading-relaxed font-body">
            Get notifications about new cat sightings
          </p>
          <div className="flex flex-col w-full max-w-md space-y-3">
            {/* EMAIL INPUT */}
            <input
              type="email"
              placeholder="your@uta.edu"
              className="
      w-full px-5 py-2 
      bg-white/10 backdrop-blur-md 
      border border-white/20 rounded-xl 
      text-white placeholder:text-white/50 
      text-base font-body 
      focus:outline-none focus:bg-white/15 
      focus:border-[#E2C3A7] focus:ring-2 focus:ring-[#E2C3A7] focus:ring-inset 
      transition-all duration-200
      shadow-lg
    "
            />

            {/* SUBSCRIBE BUTTON */}
            <Button
              className="
      w-full bg-[#E2C3A7] text-[#4E2A17] 
      hover:bg-[#d4a88c] hover:shadow-xl 
      font-bold text-sm uppercase tracking-wider 
      py-3.5 
      shadow-lg 
      transition-all duration-300 
      font-heading 
      rounded-xl
    "
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-10 bg-white/20" />

      <p className="text-center text-white/70 text-base font-body">
        © 2025 Meowvrick. Made for UTA's campus cats
      </p>
    </footer>
  );
}
