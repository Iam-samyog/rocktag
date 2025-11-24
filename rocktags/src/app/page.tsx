'use client';


import { HeroCarousel } from "@/app/components/Landing_page_components/HeroCarousel";
import { InfoSection } from "@/app/components/Landing_page_components/InfoSection";
import { HowToUse } from "@/app/components/Landing_page_components/HowToUse";
import { Footer } from "@/app/components/Landing_page_components/Footer";
import {Navbar} from "@/app/components/Landing_page_components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen  text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap');
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-fade-in-delay { animation: fadeIn 1s ease-out 0.3s both; }
        .animate-fade-in-delay-2 { animation: fadeIn 1s ease-out 0.6s both; }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <Navbar />
      <HeroCarousel />
      <InfoSection />
      <HowToUse />
      <Footer />
    </div>
  );
}