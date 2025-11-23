"use client";

import { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import type { Cat, Building, LatLng, MapOptionsShape } from "./types";
import type { LoadScriptProps } from "@react-google-maps/api";

// Custom map style with UTA colors
const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#a8e6cf" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#dcedc1" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#84d2f6" }],
  },
  {
    featureType: "poi.school",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffd3b6" }],
  },
];

// Cat icon using UTA ORANGE gradient
const catIcon = {
  url: "data:image/svg+xml;utf8,<svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='catGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%23ff6b00;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23e55d00;stop-opacity:1' /></linearGradient><filter id='shadow'><feDropShadow dx='0' dy='2' stdDeviation='2' flood-opacity='0.3'/></filter></defs><circle cx='24' cy='24' r='20' fill='url(%23catGrad)' stroke='%23ffffff' stroke-width='3' filter='url(%23shadow)'/><ellipse cx='17' cy='22' rx='3' ry='4' fill='%23ffffff'/><ellipse cx='31' cy='22' rx='3' ry='4' fill='%23ffffff'/><circle cx='17' cy='22' r='1.5' fill='%23333333'/><circle cx='31' cy='22' r='1.5' fill='%23333333'/><path d='M18 30c2 3 10 3 12 0' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'/><path d='M10 14l6 6M38 14l-6 6' stroke='%23ff6b00' stroke-width='3' stroke-linecap='round' filter='url(%23shadow)'/><circle cx='24' cy='28' r='1.5' fill='%23ff4757'/></svg>",
  scaledSize: { width: 48, height: 48 },
};

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

  return (
    <div className="min-h-screen bg-blue-50">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <header className="relative bg-gradient-to-r from-[#0039c8] to-[#ff6b00] shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                CatMap <span className="text-yellow-300">@</span> UTA
              </h1>
              <p className="text-white text-lg font-medium tracking-wide flex items-center justify-center gap-2">
                <i className="fas fa-paw"></i>
                Track Your Feline Friends on Campus
                <i className="fas fa-paw"></i>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className="bg-white rounded-full p-3 shadow-lg animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                <i className="fas fa-heart text-4xl text-red-500"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#ff6b00] transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                  Campus Cats 🐾
                </p>
                <p className="text-4xl font-black text-[#ff6b00] mt-1">
                  {campusCats.length}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-4">
                <i className="fas fa-cat text-3xl text-[#ff6b00]"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#0039c8] transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                  Campus Buildings 🏛️
                </p>
                <p className="text-4xl font-black text-[#0039c8] mt-1">
                  {visibleBuildings.length}/{allBuildings.length}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <i className="fas fa-building text-3xl text-[#0039c8]"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#ff6b00] transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                  Total Sightings 👀
                </p>
                <p className="text-4xl font-black text-[#ff6b00] mt-1">
                  {campusCats.reduce((sum, cat) => sum + cat.sightings, 0)}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-4">
                <i className="fas fa-eye text-3xl text-[#ff6b00]"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-white">
          <div className="relative h-[70vh] rounded-2xl overflow-hidden shadow-inner">
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              libraries={libraries}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={defaultZoom}
                options={mapOptions as any}
                onZoomChanged={() => {
                  if (window.google && window.google.maps) {
                    const map = document.querySelector(".gm-style")
                      ?.parentElement as any;
                    if (map) {
                      setTimeout(() => {
                        const mapInstance = map.__gm;
                        if (mapInstance) {
                          setCurrentZoom(Math.round(mapInstance.zoom || 16));
                        }
                      }, 100);
                    }
                  }
                }}
              >
                {visibleBuildings.map((building, idx) => (
                  <Marker
                    key={`building-${building.abbr}`}
                    position={{ lat: building.lat, lng: building.lng }}
                    icon={buildingIcon as any}
                    onClick={() => setActiveBuildingIndex(idx)}
                    title={building.name}
                    label={
                      currentZoom >= 17
                        ? {
                            text: building.abbr,
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }
                        : undefined
                    }
                  >
                    {activeBuildingIndex === idx && (
                      <InfoWindow
                        position={{
                          lat: building.lat + 0.0004,
                          lng: building.lng,
                        }}
                        onCloseClick={() => setActiveBuildingIndex(null)}
                      >
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <i className="fas fa-building text-[#0039c8] text-lg"></i>
                            <div className="font-bold text-[#0039c8] text-base">
                              {building.name}
                            </div>
                          </div>
                          <div className="text-gray-600 text-sm flex items-center gap-1">
                            <i className="fas fa-map-marker-alt text-gray-400"></i>
                            <span>{building.abbr} • UTA Campus</span>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                ))}

                {campusCats.map((cat, idx) => (
                  <Marker
                    key={`cat-${cat.id}`}
                    position={{ lat: cat.lat, lng: cat.lng }}
                    icon={catIcon as any}
                    onClick={() => {
                      setActiveCatIndex(idx);
                      setSelectedCatProfile(cat);
                      setSidebarOpen(true);
                    }}
                    animation={
                      activeCatIndex === idx
                        ? (window.google as any)?.maps?.Animation?.BOUNCE
                        : null
                    }
                    label={{
                      text: cat.name,
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "bold",
                      className: "cat-label",
                    }}
                  >
                    {activeCatIndex === idx && !sidebarOpen && (
                      <InfoWindow
                        position={{ lat: cat.lat + 0.0004, lng: cat.lng }}
                        onCloseClick={() => setActiveCatIndex(null)}
                      >
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <i className="fas fa-cat text-[#ff6b00] text-lg"></i>
                            <div className="font-bold text-[#ff6b00] text-base">
                              {cat.name}
                            </div>
                          </div>
                          <div className="text-gray-700 text-sm mb-1">
                            {cat.color}
                          </div>
                          <div className="text-gray-600 text-xs italic">
                            {cat.activity}
                          </div>
                          <div className="mt-2 text-xs text-[#ff6b00] font-semibold">
                            Click for full profile →
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </main>

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
      </div>

      <footer className="bg-gradient-to-r from-[#0039c8] to-[#ff6b00] text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="flex items-center justify-center gap-2 text-lg">
            Made with <i className="fas fa-heart text-red-500"></i> for UTA Cat
            Lovers
          </p>
          <p className="text-blue-100 text-sm mt-2">
            <i className="fas fa-paw"></i> Catify Your Campus{" "}
            <i className="fas fa-paw"></i>
          </p>
        </div>
      </footer>
    </div>
  );
}
