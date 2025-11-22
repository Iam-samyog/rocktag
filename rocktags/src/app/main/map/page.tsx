"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

<<<<<<< HEAD
// Custom map style with UTA colors
const mapStyles = [
=======
import type { Cat, Building } from "@/types";
import { Navbar } from "@/app/components/Landing_page_components/Navbar";
import { Footer } from "@/app/components/Landing_page_components/Footer";

// Correct path: component lives in src/components/
const MapWithEverything = dynamic(
  () => import("@/app/components/MapWithCatsAndBuildings"),
>>>>>>> upstream/main
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

<<<<<<< HEAD
// Building icon using UTA BLUE gradient
const buildingIcon = {
  url: "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='buildGrad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'><stop offset='0%25' style='stop-color:%230039c8;stop-opacity:1' /><stop offset='100%25' style='stop-color:%232a3fd7;stop-opacity:1' /></linearGradient><filter id='bldgShadow'><feDropShadow dx='0' dy='2' stdDeviation='2' flood-opacity='0.4'/></filter></defs><rect x='8' y='10' width='24' height='26' rx='2' fill='url(%23buildGrad)' stroke='%23ffffff' stroke-width='2.5' filter='url(%23bldgShadow)'/><rect x='13' y='15' width='4' height='4' rx='1' fill='%23ffd32a'/><rect x='13' y='21' width='4' height='4' rx='1' fill='%23ffd32a'/><rect x='13' y='27' width='4' height='4' rx='1' fill='%23ffd32a'/><rect x='23' y='15' width='4' height='4' rx='1' fill='%23ffd32a'/><rect x='23' y='21' width='4' height='4' rx='1' fill='%23ffd32a'/><rect x='18' y='28' width='4' height='8' rx='1' fill='%23ff6348'/><circle cx='20' cy='7' r='3' fill='%23ffd32a' stroke='%23ffffff' stroke-width='1.5'/></svg>",
  scaledSize: { width: 40, height: 40 },
};

const libraries: LoadScriptProps["libraries"] = ["places"];

import React from "react";
import ProfileCard from "@/components/ProfileCard";

export default function Home(): React.ReactElement {
  const [activeCatIndex, setActiveCatIndex] = useState<number | null>(null);
  const [activeBuildingIndex, setActiveBuildingIndex] = useState<number | null>(
    null
  );
  const [currentZoom, setCurrentZoom] = useState<number>(16);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCatProfile, setSelectedCatProfile] = useState<Cat | null>(
    null
  );
  // Hover state & timeout to keep sidebar open while user moves between marker and sidebar
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = (delay = 250) => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      if (!sidebarHovered) {
        setSidebarOpen(false);
        setActiveCatIndex(null);
        setSelectedCatProfile(null);
      }
    }, delay) as unknown as number;
  };

  // UTA Colors
  const utaBlue = "#0039c8";
  const utaOrange = "#ff6b00";

  // Predefined campus cats with their locations and details
  const campusCats: Cat[] = [
    {
      id: 1,
      name: "Microwave",
      lat: 32.7315,
      lng: -97.11,
      color: "Orange Tabby",
      personality: "Friendly",
      activity: "Lounging near the University Center",
      age: 3,
      friendliness: 5,
      favSpot: "University Center entrance",
      bio: "The most famous cat on campus! Microwave got their name from always hanging around the UC looking for warm spots. Extremely friendly and loves attention from students.",
      sightings: 156,
      bestTime: "Lunch hours (11am-2pm)",
    },
    {
      id: 2,
      name: "Professor Whiskers",
      lat: 32.7312,
      lng: -97.1147,
      color: "Gray",
      personality: "Wise",
      activity: "Reading on library steps",
      age: 7,
      friendliness: 3,
      favSpot: "Library steps",
      bio: "A distinguished older cat who seems to have attended more classes than most students. Often found near the library, observing campus life with scholarly interest.",
      sightings: 89,
      bestTime: "Early morning",
    },
    {
      id: 3,
      name: "Shadow",
      lat: 32.7327,
      lng: -97.1116,
      color: "Black",
      personality: "Mysterious",
      activity: "Exploring the engineering building",
      age: 2,
      friendliness: 2,
      favSpot: "Engineering Research Building",
      bio: "An elusive black cat that appears and disappears like a shadow. Engineering students claim Shadow brings good luck during finals week.",
      sightings: 34,
      bestTime: "Evening",
    },
    {
      id: 4,
      name: "Maverick",
      lat: 32.7351,
      lng: -97.1202,
      color: "Calico",
      personality: "Energetic",
      activity: "Chasing birds near the stadium",
      age: 1,
      friendliness: 4,
      favSpot: "Maverick Stadium",
      bio: "Named after the school mascot, this spirited young cat loves to run around the stadium. Often seen practicing 'touchdowns' with fallen leaves.",
      sightings: 67,
      bestTime: "Afternoon",
    },
    {
      id: 5,
      name: "Duchess",
      lat: 32.7307,
      lng: -97.1162,
      color: "White Persian",
      personality: "Regal",
      activity: "Sunbathing at Fine Arts",
      age: 5,
      friendliness: 3,
      favSpot: "Fine Arts Building courtyard",
      bio: "An elegant white cat with an aristocratic air. Art students swear she poses for their sketches. Only accepts pets on her terms.",
      sightings: 78,
      bestTime: "Midday",
    },
    {
      id: 6,
      name: "Einstein",
      lat: 32.7297,
      lng: -97.1137,
      color: "Brown Tabby",
      personality: "Curious",
      activity: "Investigating science experiments",
      age: 4,
      friendliness: 4,
      favSpot: "Science Hall",
      bio: "This inquisitive cat has been spotted peering through science lab windows. Science majors consider Einstein their unofficial lab mascot.",
      sightings: 92,
      bestTime: "All day",
    },
    {
      id: 7,
      name: "Biscuit",
      lat: 32.7302,
      lng: -97.1122,
      color: "Orange and White",
      personality: "Playful",
      activity: "Begging for food at Business Building",
      age: 2,
      friendliness: 5,
      favSpot: "Business Building cafeteria",
      bio: "The campus food enthusiast! Biscuit has mastered the art of looking pitiful to score treats from business students during lunch breaks.",
      sightings: 143,
      bestTime: "Lunch time",
    },
    {
      id: 8,
      name: "Luna",
      lat: 32.7322,
      lng: -97.1131,
      color: "Silver Tabby",
      personality: "Gentle",
      activity: "Napping in the garden",
      age: 6,
      friendliness: 4,
      favSpot: "Nedderman Hall gardens",
      bio: "A peaceful cat who loves the quiet gardens. Luna is therapeutic for stressed students - many come to pet her during exam season.",
      sightings: 104,
      bestTime: "Morning",
    },
    {
      id: 9,
      name: "Pixel",
      lat: 32.732,
      lng: -97.1107,
      color: "Tuxedo",
      personality: "Tech-savvy",
      activity: "Sitting on laptops",
      age: 3,
      friendliness: 5,
      favSpot: "Near the computer labs",
      bio: "This cat has an uncanny ability to walk across keyboards at the most crucial moments. Computer science students have named multiple bugs after Pixel.",
      sightings: 87,
      bestTime: "Evening",
    },
    {
      id: 10,
      name: "Pepper",
      lat: 32.7308,
      lng: -97.1127,
      color: "Black and White",
      personality: "Adventurous",
      activity: "Climbing trees",
      age: 2,
      friendliness: 4,
      favSpot: "Life Science Building",
      bio: "An athletic cat who loves to climb. Biology students study Pepper's behavior for their animal behavior classes.",
      sightings: 71,
      bestTime: "Afternoon",
    },
  ];

  // Buildings with priority levels
  const allBuildings: Building[] = [
    {
      name: "E.H. Hereford University Center",
      abbr: "UC",
      lat: 32.7315,
      lng: -97.11,
      priority: 1,
    },
    { name: "Library", abbr: "LIBR", lat: 32.7312, lng: -97.1147, priority: 1 },
    {
      name: "College Park Center",
      abbr: "CPC",
      lat: 32.7316,
      lng: -97.1081,
      priority: 1,
    },
    {
      name: "Engineering Research Building",
      abbr: "ERB",
      lat: 32.7327,
      lng: -97.1116,
      priority: 1,
    },
    {
      name: "Science Hall",
      abbr: "SH",
      lat: 32.7297,
      lng: -97.1137,
      priority: 1,
    },
    {
      name: "Business Building",
      abbr: "COBA",
      lat: 32.7302,
      lng: -97.1122,
      priority: 1,
    },
    {
      name: "Maverick Stadium",
      abbr: "STAD",
      lat: 32.7351,
      lng: -97.1202,
      priority: 2,
    },
    {
      name: "Fine Arts Building",
      abbr: "FA",
      lat: 32.7307,
      lng: -97.1162,
      priority: 2,
    },
    {
      name: "Nedderman Hall",
      abbr: "NH",
      lat: 32.7322,
      lng: -97.1131,
      priority: 2,
    },
    {
      name: "Life Science Building",
      abbr: "LS",
      lat: 32.7308,
      lng: -97.1127,
      priority: 2,
    },
    {
      name: "Science & Engineering Innovation & Research Building",
      abbr: "SI",
      lat: 32.732,
      lng: -97.1107,
      priority: 2,
    },
    {
      name: "Preston Hall",
      abbr: "PH",
      lat: 32.7298,
      lng: -97.1105,
      priority: 2,
    },
    {
      name: "Ransom Hall",
      abbr: "RH",
      lat: 32.7295,
      lng: -97.1117,
      priority: 2,
    },
    {
      name: "Hammond Hall",
      abbr: "HH",
      lat: 32.7308,
      lng: -97.1145,
      priority: 2,
    },
    {
      name: "Pickard Hall",
      abbr: "PKH",
      lat: 32.7305,
      lng: -97.1155,
      priority: 2,
    },
    {
      name: "University Hall",
      abbr: "UH",
      lat: 32.7293,
      lng: -97.1128,
      priority: 2,
    },
    {
      name: "Chemistry & Physics Building",
      abbr: "CPB",
      lat: 32.731,
      lng: -97.112,
      priority: 3,
    },
    {
      name: "W. A. Baker Chemistry Research Building",
      abbr: "CRB",
      lat: 32.7313,
      lng: -97.1125,
      priority: 3,
    },
    {
      name: "Maverick Activities Center",
      abbr: "MAC",
      lat: 32.734,
      lng: -97.1095,
      priority: 3,
    },
    {
      name: "College Hall",
      abbr: "CH",
      lat: 32.7288,
      lng: -97.1115,
      priority: 3,
    },
    {
      name: "Texas Hall",
      abbr: "TEX",
      lat: 32.7285,
      lng: -97.1098,
      priority: 3,
    },
    { name: "Woolf Hall", abbr: "WH", lat: 32.73, lng: -97.1092, priority: 3 },
    {
      name: "Trinity Hall",
      abbr: "TRN",
      lat: 32.731,
      lng: -97.1085,
      priority: 3,
    },
  ];

  const getVisibleBuildings = (): Building[] => {
    if (currentZoom < 16) {
      return allBuildings.filter((b) => b.priority === 1);
    } else if (currentZoom < 17) {
      return allBuildings.filter((b) => b.priority <= 2);
    } else {
      return allBuildings;
    }
  };

  const visibleBuildings = getVisibleBuildings();

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  } as const;

  const center: LatLng = { lat: 32.7318, lng: -97.1115 };
  const defaultZoom = 16;

  const bounds = {
    north: 32.738,
    south: 32.725,
    east: -97.105,
    west: -97.118,
  };

  const mapOptions: MapOptionsShape = {
    styles: mapStyles,
    restriction: {
      latLngBounds: bounds,
      strictBounds: false,
    },
    minZoom: 15,
    maxZoom: 18,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    gestureHandling: "greedy",
  };
=======
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
>>>>>>> upstream/main

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

<<<<<<< HEAD
      {/* Centered Sidebar for Cat Profile */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-[#0039c8] transition-opacity duration-300 ${
            sidebarOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => {
            setSidebarOpen(false);
            setActiveCatIndex(null);
          }}
        />

        {/* Sidebar Content: render ProfileCard directly (no outer white wrapper) */}
        <div
          className={`relative w-full max-w-md transform transition-all duration-300 max-h-[90vh] overflow-y-auto ${
            sidebarOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="p-6">
            <ProfileCard
              catId={
                activeCatIndex !== null
                  ? campusCats[activeCatIndex].id.toString()
                  : "default"
              }
            />
          </div>
        </div>
=======
 <div className="mt-[40px] text-white">
    <Footer />
>>>>>>> upstream/main
      </div>
     
    </div>
  );
}