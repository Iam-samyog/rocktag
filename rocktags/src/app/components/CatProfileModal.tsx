"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Mock type for demonstration
interface Cat {
  id: string;
  name: string;
  personality: string;
  age: number;
  sightings: number;
  friendliness: number;
  color: string;
  bestTime: string;
  traits?: string[];
  bio: string;
  favSpot: string;
  activity: string;
  favoriteRubbingPlace?: string;
  profileImage?: string;
  gallery?: string[];
}

interface Props {
  cat: Cat | null;
  onClose: () => void;
}

export default function CatProfileModal({ cat, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Scroll indicator logic
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      const visibleRatio = maxScroll > 0 ? (clientHeight / scrollHeight) * 100 : 100;

      el.style.setProperty("--scroll-percent", `${scrollPercent}%`);
      el.style.setProperty("--visible-ratio", `${visibleRatio}%`);
    };

    update();
    el.addEventListener("scroll", update);
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [cat]);

  if (!cat) return null;

  return (
    <>
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Modal Card */}
        <div
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`cat-profile-${cat.id}`}
        >
          {/* Header with Gradient Background */}
          <div className="relative h-85 bg-[#4E2A17]">
            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 hover:rotate-90 transition-all duration-300 shadow-lg group z-20"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Image - Perfect Circle with Elegant Border - Overlapping both sections */}
          <div className="absolute top-[40px] left-1/2 -translate-x-1/2 z-30">
            <div className="relative">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E2C3A7] to-[#4E2A17] rounded-full blur-xl opacity-40 scale-110" />
              
              {/* Main profile container */}
              <div className="relative w-44 h-44 rounded-full bg-white p-2 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-[#E2C3A7] ring-offset-2 ring-offset-white bg-white">
                  <Image
                    src={cat.profileImage ?? "/api/placeholder/400/400"}
                    alt={`${cat.name} profile`}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div
            ref={scrollRef}
            className="relative flex-1 overflow-y-auto px-8 pt-36 pb-8 bg-gradient-to-b from-white to-[#FFF9F5]"
            style={{ "--scroll-percent": "0%", "--visible-ratio": "100%" } as React.CSSProperties}
          >
            {/* Custom Scroll Indicator */}
            <div className="fixed right-6 top-56 bottom-6 w-1 bg-[#E2C3A7]/30 rounded-full overflow-hidden z-30">
              <div
                className="absolute inset-x-0 bg-gradient-to-b from-[#4E2A17] to-[#8B5A2B] rounded-full transition-all duration-200"
                style={{
                  height: "var(--visible-ratio)",
                  transform: "translateY(calc(var(--scroll-percent) * (100% - var(--visible-ratio)) / 100))",
                }}
              />
            </div>

            {/* Name & Tagline */}
            <div className="text-center mb-10">
              <h2
                id={`cat-profile-${cat.id}`}
                className="text-5xl font-bold text-[#4E2A17] mb-3 tracking-tight"
              >
                {cat.name}
              </h2>
              <div className="flex items-center justify-center gap-3 text-lg text-[#6B3D22]">
                <span className="font-semibold">{cat.personality}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2C3A7]" />
                <span className="font-medium">{cat.age} {cat.age === 1 ? "year" : "years"} old</span>
              </div>
            </div>

            {/* Stats Grid - Enhanced Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard label="Sightings" value={cat.sightings} iconClass="fa-solid fa-eye" />
              <StatCard label="Friendliness" value={cat.friendliness} iconClass="fa-solid fa-star" max={5} />
              <StatCard label="Color" value={cat.color} iconClass="fa-solid fa-palette" isText />
              <StatCard label="Best Time" value={cat.bestTime} iconClass="fa-solid fa-clock" isText />
            </div>

            {/* Personality Traits */}
            {cat.traits && cat.traits.length > 0 && (
              <Section title="Personality Traits" iconClass="fa-solid fa-sparkles">
                <div className="flex flex-wrap gap-3">
                  {cat.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#E2C3A7]/40 to-[#E2C3A7]/20 text-[#4E2A17] rounded-full text-sm font-semibold border-2 border-[#E2C3A7] hover:shadow-md hover:scale-105 transition-all duration-200 cursor-default"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* About Section */}
            <Section title={`About ${cat.name}`} iconClass="fa-solid fa-book">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#E2C3A7]/30">
                <p className="text-[#4E2A17] leading-relaxed text-base">
                  {cat.bio}
                </p>
              </div>
            </Section>

            {/* Location Info Grid */}
            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {/* Favorite Spot */}
              <div className="bg-gradient-to-br from-[#E2C3A7]/30 to-[#E2C3A7]/10 rounded-2xl p-6 border-2 border-[#E2C3A7]/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-[#4E2A17] text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#4E2A17]/70 uppercase tracking-wider mb-1">Favorite Spot</h4>
                    <div className="font-bold text-[#4E2A17] text-xl mb-1">{cat.favSpot}</div>
                    <div className="text-sm text-[#4E2A17]/70">Usually {cat.activity}</div>
                  </div>
                </div>
              </div>

              {/* Favorite Rubbing Place */}
              {cat.favoriteRubbingPlace && (
                <div className="bg-gradient-to-br from-[#E2C3A7]/30 to-[#E2C3A7]/10 rounded-2xl p-6 border-2 border-[#E2C3A7]/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <i className="fa-solid fa-heart text-[#4E2A17] text-2xl"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#4E2A17]/70 uppercase tracking-wider mb-1">Favorite Rubbing Place</h4>
                      <div className="font-bold text-[#4E2A17] text-xl">{cat.favoriteRubbingPlace}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Section */}
            {cat.gallery && cat.gallery.length > 0 && (
              <Section title="Photo Gallery" iconClass="fa-solid fa-camera">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cat.gallery.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-[#E2C3A7]/30 hover:border-[#E2C3A7] bg-white"
                    >
                      <Image
                        src={img}
                        alt={`${cat.name} gallery ${i + 1}`}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#4E2A17] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:rotate-90 transition-all duration-300 shadow-2xl z-10"
            aria-label="Close image"
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
          
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Full size view"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────── REUSABLE COMPONENTS ──────────────────────── */

function Section({ title, iconClass, children }: { title: string; iconClass: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <i className={`${iconClass} text-[#4E2A17] text-xl`}></i>
        <h3 className="text-2xl font-bold text-[#4E2A17] tracking-tight">
          {title}
        </h3>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#E2C3A7] to-transparent" />
      </div>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  iconClass,
  max,
  isText = false,
}: {
  label: string;
  value: string | number;
  iconClass: string;
  max?: number;
  isText?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 text-center border-2 border-[#E2C3A7]/40 hover:border-[#E2C3A7] hover:shadow-lg transition-all duration-300 group">
      <div className="mb-2 group-hover:scale-110 transition-transform duration-300">
        <i className={`${iconClass} text-[#4E2A17] text-3xl`}></i>
      </div>
      <div className="text-2xl font-bold text-[#4E2A17] mb-1">
        {isText ? value : max ? `${value}/${max}` : value}
      </div>
      <div className="text-xs font-semibold text-[#4E2A17]/60 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}