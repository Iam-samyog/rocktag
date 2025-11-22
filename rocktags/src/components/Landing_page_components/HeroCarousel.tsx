"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/button-group";

const catSlides = [
  { src: "", alt: "Cat playing with toys" },
  { src: "", alt: "Cat sleeping in sunbath" },
  { src: "", alt: "Cat running on campus" },
];

export function HeroCarousel() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % catSlides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const goPrev = () => {
    if (animating) return;
    setAnimating(true);
    setSlide((s) => (s === 0 ? catSlides.length - 1 : s - 1));
    setTimeout(() => setAnimating(false), 600);
  };

  const goNext = () => {
    if (animating) return;
    setAnimating(true);
    setSlide((s) => (s + 1) % catSlides.length);
    setTimeout(() => setAnimating(false), 600);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#4E2A17]/20 to-transparent">
      {/* Slides */}
      {catSlides.map((img, i) => (
        <div
          key={i}
          className={`
            absolute inset-0 transition-all duration-700 ease-in-out
            ${i === slide ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          `}
          style={{ transform: `translateX(${(i - slide) * 100}%)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#4E2A17]/95 via-[#4E2A17]/60 to-transparent z-10" />
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            priority={i === 0}
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/1920x1080/6D4C41/FFFFFF?text=${encodeURIComponent(img.alt)}`;
            }}
          />
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {catSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`
              transition-all duration-300 rounded-full
              ${i === slide
                ? "w-14 h-3 bg-[#E2C3A7] shadow-lg shadow-[#E2C3A7]/50"
                : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }
            `}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 group transition-all duration-300 shadow-lg"
      >
        <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 group transition-all duration-300 shadow-lg"
      >
        <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Content – PERFECTLY CENTERED */}
      <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
        <h1 className="  text-5xl sm:text-6xl md:text-7xl font-bold font-heading text-white mb-4 leading-tight drop-shadow-lg">
          Track Campus Cats
          <span className="block text-[#E2C3A7] mt-2 drop-shadow-md leading-[50px]">with Meowvrick</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 text-white/90 font-body max-w-3xl mx-auto leading-relaxed">
          Discover, follow, and connect with UTA’s beloved feline residents
        </p>

        {/* BUTTONS: CENTERED & BALANCED */}
        <div className="flex justify-center items-center gap-3">
          {/* Sign In */}
          <Button
            size="lg"
            onClick={() => router.push("/signin")}
            className="bg-[#4E2A17] hover:bg-[#3d1f0f] text-white font-bold px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <LogIn className="w-5 h-5 mr-2" /> Sign In
          </Button>

          {/* Separator – Only on sm+ */}
          <div className="hidden sm:block w-px h-10 bg-white/30" />

          {/* Sign Up */}
          <Button
            size="lg"
            variant="outline"
            className="bg-white/95 backdrop-blur-sm hover:bg-white text-[#4E2A17] border-2 border-[#E2C3A7] font-bold px-8 py-5 rounded-xl shadow-xl hover:shadow-2xl hover:border-[#d4a88c] transition-all duration-300"
            onClick={() => router.push("/signup")}
          >
            <UserPlus className="w-5 h-5 mr-2" /> Sign Up
          </Button>
        </div>
      </div>
    </section>
  );
}