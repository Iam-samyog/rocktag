"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { Cat, Building } from "@/types";
import { Navbar } from "@/app/components/Landing_page_components/Navbar";
import { Footer } from "@/app/components/Landing_page_components/Footer";
import { fetchTrackerLocations, buildTrackerRequests } from "@/lib/trackerApi";

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
  const [isUpdatingLocations, setIsUpdatingLocations] = useState(false);

  // Fetch static data from public folder
  useEffect(() => {
    fetch("/data/campus-data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((fetchedData) => {
        console.log("✅ Campus data loaded:", fetchedData);
        console.log("📍 Cats:", fetchedData.cats);
        console.log("🏢 Buildings:", fetchedData.buildings);
        setData(fetchedData);
      })
      .catch((err) => console.error("❌ Failed to load campus data:", err));
  }, []);

  // Fetch real-time tracker locations
  useEffect(() => {
    if (data.cats.length === 0) return;

    const updateTrackerLocations = async () => {
      try {
        setIsUpdatingLocations(true);
        
        // Build tracker requests only for cats with private keys
        const trackerRequests = buildTrackerRequests(data.cats);
        
        if (trackerRequests.length === 0) {
          console.log("⚠️ No cats with private keys configured for real-time tracking");
          return;
        }

        console.log("🔄 Updating tracker locations for:", trackerRequests);
        console.log("📊 Tracker details:", {
          count: trackerRequests.length,
          names: trackerRequests.map(t => t.name),
        });

        // Fetch real-time locations from backend
        const locations = await fetchTrackerLocations(trackerRequests);

        console.log("📍 Received tracker locations:", locations);
        console.log("📊 Locations object keys:", Object.keys(locations));

        // Check if we got any real-time data
        if (Object.keys(locations).length === 0) {
          console.warn("⚠️ No tracker data received - keeping static cat positions from campus-data.json");
          // Don't update - keep the existing cat positions
          return;
        }

        // Update cat positions with real-time data only if we got data
        setData((prevData) => ({
          ...prevData,
          cats: prevData.cats.map((cat) => {
            const trackerData = locations[cat.name];
            if (trackerData) {
              console.log(`✅ Updating ${cat.name} to:`, trackerData);
              return {
                ...cat,
                lat: trackerData.latitude,
                lng: trackerData.longitude,
                lastUpdated: trackerData.timestamp,
                isRealTime: true,
              };
            }
            // Keep the cat's current position if no tracker data for it
            console.log(`⚠️ No real-time data for ${cat.name}, keeping current position`);
            return cat;
          }),
        }));
      } catch (err) {
        console.error("⚠️ Failed to update tracker locations:", err);
        console.warn("⚠️ Using static cat positions from campus-data.json");
        // Don't break the map - just keep using the current cat positions
      } finally {
        setIsUpdatingLocations(false);
      }
    };

    // Update immediately on mount
    updateTrackerLocations();

    // Then update every 10 seconds for real-time tracking
    const interval = setInterval(updateTrackerLocations, 10000);

    return () => clearInterval(interval);
  }, [data.cats.length]);

  return (
    <div className="min-h-screen bg-[#FFFCF4] flex flex-col">
      
      <div className="mb-[80px] font-poppins text-white">
        <Navbar />
      </div>
      

      <main className="flex-1 container mx-auto px-6 py-8 ">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {isUpdatingLocations && (
            <div className="text-sm text-gray-500 mb-2">
              🔄 Updating real-time cats locations...
            </div>
          )}
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