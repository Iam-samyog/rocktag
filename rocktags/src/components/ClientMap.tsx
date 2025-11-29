"use client";

import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import type { Cat, Building, MapOptionsShape } from "./types";

// Custom map style with your theme colors
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
    stylers: [{ color: "#E2C3A7" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#F5E6D3" }],
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
    stylers: [{ color: "#A7D2E2" }],
  },
  {
    featureType: "poi.school",
    elementType: "geometry.fill",
    stylers: [{ color: "#E2C3A7" }],
  },
];

const libraries: ("places")[] = ["places"];

// Cat icon using your theme colors
const catIcon = {
  url: "data:image/svg+xml;utf8,<svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='catGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%23E2C3A7;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23D4B094;stop-opacity:1' /></linearGradient><filter id='shadow'><feDropShadow dx='0' dy='2' stdDeviation='2' flood-opacity='0.3'/></filter></defs><circle cx='24' cy='24' r='20' fill='url(%23catGrad)' stroke='%23ffffff' stroke-width='3' filter='url(%23shadow)'/><ellipse cx='17' cy='22' rx='3' ry='4' fill='%23ffffff'/><ellipse cx='31' cy='22' rx='3' ry='4' fill='%23ffffff'/><circle cx='17' cy='22' r='1.5' fill='%23333333'/><circle cx='31' cy='22' r='1.5' fill='%23333333'/><path d='M18 30c2 3 10 3 12 0' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'/><path d='M10 14l6 6M38 14l-6 6' stroke='%23D4B094' stroke-width='3' stroke-linecap='round' filter='url(%23shadow)'/><circle cx='24' cy='28' r='1.5' fill='%23D4B094'/></svg>",
  scaledSize: { width: 48, height: 48 },
};

// Building icon using your theme colors
const buildingIcon = {
  url: "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='buildGrad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'><stop offset='0%25' style='stop-color:%23E2C3A7;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23D4B094;stop-opacity:1' /></linearGradient><filter id='bldgShadow'><feDropShadow dx='0' dy='2' stdDeviation='2' flood-opacity='0.4'/></filter></defs><rect x='8' y='10' width='24' height='26' rx='2' fill='url(%23buildGrad)' stroke='%23ffffff' stroke-width='2.5' filter='url(%23bldgShadow)'/><rect x='13' y='15' width='4' height='4' rx='1' fill='%23F5E6D3'/><rect x='13' y='21' width='4' height='4' rx='1' fill='%23F5E6D3'/><rect x='13' y='27' width='4' height='4' rx='1' fill='%23F5E6D3'/><rect x='23' y='15' width='4' height='4' rx='1' fill='%23F5E6D3'/><rect x='23' y='21' width='4' height='4' rx='1' fill='%23F5E6D3'/><rect x='18' y='28' width='4' height='8' rx='1' fill='%23D4B094'/><circle cx='20' cy='7' r='3' fill='%23F5E6D3' stroke='%23ffffff' stroke-width='1.5'/></svg>",
  scaledSize: { width: 40, height: 40 },
};

interface ClientMapProps {
  campusCats: Cat[];
  allBuildings: Building[];
  onCatClick: (cat: Cat) => void;
  onBuildingClick: (building: Building) => void;
  onInfoWindowClose: () => void;
}

export function ClientMap({ 
  campusCats, 
  allBuildings, 
  onCatClick, 
  onBuildingClick, 
  onInfoWindowClose 
}: ClientMapProps) {
  const [activeCatIndex, setActiveCatIndex] = useState<number | null>(null);
  const [activeBuildingIndex, setActiveBuildingIndex] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(16);

  const getVisibleBuildings = () => {
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
  };

  const center = { lat: 32.7318, lng: -97.1115 };
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
  } as any;

  return (
    <div className="h-[70vh] rounded-2xl overflow-hidden shadow-inner">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={defaultZoom}
          options={mapOptions}
          onZoomChanged={() => {
            const map = document.querySelector(".gm-style")?.parentElement as any;
            if (map?.__gm) {
              setTimeout(() => {
                setCurrentZoom(Math.round(map.__gm.zoom || 16));
              }, 100);
            }
          }}
        >
          {visibleBuildings.map((building, idx) => (
            <Marker
              key={`building-${building.abbr}`}
              position={{ lat: building.lat, lng: building.lng }}
              icon={buildingIcon as any}
              onClick={() => {
                setActiveBuildingIndex(idx);
                onBuildingClick(building);
              }}
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
                  onCloseClick={() => {
                    setActiveBuildingIndex(null);
                    onInfoWindowClose();
                  }}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fas fa-building text-[#E2C3A7] text-lg"></i>
                      <div className="font-bold text-[#E2C3A7] text-base">
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
                onCatClick(cat);
              }}
              animation={window.google?.maps?.Animation?.BOUNCE}
              label={{
                text: cat.name,
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "bold",
                className: "cat-label",
              }}
            >
              {activeCatIndex === idx && (
                <InfoWindow
                  position={{ lat: cat.lat + 0.0004, lng: cat.lng }}
                  onCloseClick={() => {
                    setActiveCatIndex(null);
                    onInfoWindowClose();
                  }}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fas fa-cat text-[#E2C3A7] text-lg"></i>
                      <div className="font-bold text-[#E2C3A7] text-base">
                        {cat.name}
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      {cat.color}
                    </div>
                    <div className="text-gray-600 text-xs italic">
                      {cat.activity}
                    </div>
                    <div className="mt-2 text-xs text-[#E2C3A7] font-semibold">
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
  );
}
