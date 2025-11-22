'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { MapPin, Cat } from "lucide-react";

export function InfoSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-white/5">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold font-heading text-white mb-6 tracking-tight">
          Why Track Campus Cats?
        </h2>
        <div className="w-24 h-1 bg-[#E2C3A7] mx-auto mb-12 rounded-full shadow-lg shadow-[#E2C3A7]/50" />

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <FontAwesomeIcon icon={faPaw} className="w-24 h-24 text-[#4E2A17]" />,
              title: "Community Building",
              desc: "Connect with fellow cat lovers and share sightings.",
            },
            {
              icon: <MapPin className="w-10 h-10 text-[#4E2A17]" />,
              title: "Real-Time Tracking",
              desc: "See where cats are spotted on the interactive map.",
            },
            {
              icon: <Cat className="w-10 h-10 text-[#4E2A17]" />,
              title: "Cat Profiles",
              desc: "Learn personality, favorite spots & sighting history.",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="
                bg-white/10 backdrop-blur-md 
                border-2 border-[#E2C3A7]/40 rounded-2xl 
                p-8 
                shadow-[0_0_25px_rgba(226,195,167,0.3)] 
                hover:scale-105 
                hover:shadow-[0_0_50px_rgba(226,195,167,0.6)] 
                hover:border-[#E2C3A7] 
                transition-all duration-400 
                group
              "
            >
              {/* Icon Circle – LIGHT BROWN */}
              <div className="
                w-24 h-24 bg-[#E2C3A7]
                rounded-full flex items-center justify-center 
                mx-auto mb-6 
                shadow-lg shadow-[#E2C3A7]/40 
                group-hover:shadow-[#E2C3A7]/60 
                transition-shadow duration-400
              ">
                {c.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold font-heading text-black mb-3">
                {c.title}
              </h3>

              {/* Description */}
              <p className="text-sm font-body text-black leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}