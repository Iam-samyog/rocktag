"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { Cat, Building } from "@/types";
import { Navbar } from "@/app/components/Landing_page_components/Navbar";
import { Footer } from "@/app/components/Landing_page_components/Footer";

// Correct path: component lives in src/components/
const MapWithEverything = dynamic(
  () => import("@/app/components/MapWithCatsAndBuildings"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[72vh] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="animate-spin h-12 w-12 border-4 border-[#E2C3A7] rounded-full border-t-transparent"></div>
      </div>
    ),
  }
);

export default function MapPage() {
  const [data, setData] = useState<{ cats: Cat[]; buildings: Building[] }>({
    cats: [],
    buildings: [],
  });

  // Fetch JSON from public folder
 useEffect(() => {
  fetch("/data/campus-data.json")  // This works because file is in public/data/
    .then((res) => {
      if (!res.ok) throw new Error("Not found");
      return res.json();
    })
    .then(setData)
    .catch((err) => console.error("Failed to load campus data:", err));
}, []);

  return (
    <div className="min-h-screen bg-[#FFFCF4] flex flex-col">
      
      <div className="mb-[80px] font-poppins text-white">
    <Navbar />
      </div>
      

      <main className="flex-1 container mx-auto px-6 py-8 ">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="h-[72vh] rounded-xl overflow-hidden border-2 border-[#E2C3A7]/20">
            {/* Pass data to map */}
            <MapWithEverything cats={data.cats} buildings={data.buildings} />
          </div>
        </div>
      </main>

 <div className="mt-[40px] text-white">
    <Footer />
      </div>
     
    </div>
  );
}