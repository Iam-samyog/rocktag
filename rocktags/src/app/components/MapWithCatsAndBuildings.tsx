// src/app/components/MapWithCatsAndBuildings.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { Cat, Building } from "@/types";
import CatProfileModal from "./CatProfileModal";

interface Props {
  cats: Cat[];
  buildings: Building[];
  onCatClick?: (cat: Cat) => void;
}

/* ---------- UTA BOUNDS (strict) ---------- */
const UTA_BOUNDS = {
  north: 32.738,
  south: 32.725,
  east: -97.105,
  west: -97.118,
} as const;

/* ---------- MAP STYLES (theme) ---------- */
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  // === Hide visual noise ===
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },

  // === Land & Nature ===
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#FFFCF4" }], // Warm, airy base
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#D6C9C8" }], // Soft, natural park fill
  },

  // === Road Hierarchy ===
  // Highways: Bold periwinkle with rich brown outline
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#AEBBCE" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4E2A17" }, { weight: 2 }],
  },

  // Arterial roads: Warm tan with subtle taupe edge
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#4E2A17" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{ color: "#847570" }, { weight: 1 }],
  },

  // Local roads: Minimal, calming
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#D6C9C8" }],
  },

  // === Water ===
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#AEBBCE" }], // Unified with highways
  },
  {
    featureType: "water",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4E2A17" }, { weight: 1.2 }],
  },

  // === Labels: Professional & readable ===
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4E2A17" }], // Rich, elegant text
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFCF4" }, { weight: 3 }], // Crisp halo
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4E2A17" },],
  },
];
/* ---------- SVG ICONS ---------- */
const catSvg = (name: string) => encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 58" width="50" height="58">
  <defs>
    <linearGradient id="catGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D6C9C8;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#BFB3B1;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <!-- Ears -->
  <path d="M12 18 L8 8 L18 16 Z" fill="url(#catGrad)" stroke="#4E2A17" stroke-width="1.2"/>
  <path d="M38 18 L42 8 L32 16 Z" fill="url(#catGrad)" stroke="#4E2A17" stroke-width="1.2"/>
  <path d="M11 15 L9.5 11 L14 14 Z" fill="#E8B5B8" opacity="0.5"/>
  <path d="M39 15 L40.5 11 L36 14 Z" fill="#E8B5B8" opacity="0.5"/>
  
  <!-- Head -->
  <ellipse cx="25" cy="28" rx="14" ry="16" fill="url(#catGrad)" stroke="#4E2A17" stroke-width="1.3"/>
  
  <!-- Cheek fluff -->
  <ellipse cx="14" cy="32" rx="5" ry="4" fill="#D6C9C8" opacity="0.8"/>
  <ellipse cx="36" cy="32" rx="5" ry="4" fill="#D6C9C8" opacity="0.8"/>
  
  <!-- Eyes -->
  <ellipse cx="19" cy="26" rx="4" ry="4.5" fill="white"/>
  <ellipse cx="31" cy="26" rx="4" ry="4.5" fill="white"/>
  <ellipse cx="19.5" cy="26" rx="2.2" ry="3" fill="#4E2A17"/>
  <ellipse cx="31.5" cy="26" rx="2.2" ry="3" fill="#4E2A17"/>
  <circle cx="18.5" cy="24.5" r="0.8" fill="white" opacity="0.9"/>
  <circle cx="30.5" cy="24.5" r="0.8" fill="white" opacity="0.9"/>
  
  <!-- Nose & Mouth -->
  <path d="M25 31 L23 33 L27 33 Z" fill="#4E2A17"/>
  <path d="M25 33 L25 35 M25 35 Q23 36 21 36 M25 35 Q27 36 29 36" fill="none" stroke="#4E2A17" stroke-width="1" stroke-linecap="round"/>
  
  <!-- Whiskers -->
  <path d="M12 27 Q6 26 2 25 M12 29 Q6 29 2 29 M12 31 Q6 32 2 34" stroke="#4E2A17" stroke-width="0.8" stroke-linecap="round" opacity="0.8"/>
  <path d="M38 27 Q44 26 48 25 M38 29 Q44 29 48 29 M38 31 Q44 32 48 34" stroke="#4E2A17" stroke-width="0.8" stroke-linecap="round" opacity="0.8"/>
  
  <text x="25" y="56" font-family="system-ui" font-size="8.5" text-anchor="middle" fill="#4E2A17" font-weight="bold">${name}</text>
</svg>
`);

const buildingSvg = (abbr: string) => encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
  <defs>
    <linearGradient id="buildGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#847570;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#6B5D59;stop-opacity:1"/>
    </linearGradient>
  </defs>
  
  <!-- Building body -->
  <rect x="8" y="12" width="24" height="28" rx="1" fill="url(#buildGrad)" stroke="#3A2E2B" stroke-width="1.5"/>
  
  <!-- Windows -->
  <rect x="11" y="15" width="5" height="5" rx="0.5" fill="#E8DDD8" stroke="#3A2E2B" stroke-width="0.8"/>
  <rect x="24" y="15" width="5" height="5" rx="0.5" fill="#E8DDD8" stroke="#3A2E2B" stroke-width="0.8"/>
  <rect x="11" y="23" width="5" height="5" rx="0.5" fill="#E8DDD8" stroke="#3A2E2B" stroke-width="0.8"/>
  <rect x="24" y="23" width="5" height="5" rx="0.5" fill="#E8DDD8" stroke="#3A2E2B" stroke-width="0.8"/>
  <rect x="17.5" y="31" width="5" height="5" rx="0.5" fill="#E8DDD8" stroke="#3A2E2B" stroke-width="0.8"/>
  
  <!-- Door -->
  <rect x="16" y="34" width="8" height="6" fill="#5C4E4A" stroke="#3A2E2B" stroke-width="1"/>
  <path d="M16 34 Q20 32.5 24 34" fill="#5C4E4A" stroke="#3A2E2B" stroke-width="1"/>
  <circle cx="22.5" cy="36.5" r="0.6" fill="#C9A882"/>
  
  <!-- Floor lines -->
  <rect x="8" y="16" width="24" height="0.5" fill="#6B5D59" opacity="0.4"/>
  <rect x="8" y="24" width="24" height="0.5" fill="#6B5D59" opacity="0.4"/>
  <rect x="8" y="32" width="24" height="0.5" fill="#6B5D59" opacity="0.4"/>
  
  <text x="20" y="47" font-family="system-ui" font-size="7" text-anchor="middle" fill="#3A2E2B" font-weight="bold">${abbr}</text>
</svg>
`);

/* ---------- LEGEND ICONS ---------- */
const CatLegendIcon = () => (
  <div
    className="w-6 h-6"
    dangerouslySetInnerHTML={{
      __html: decodeURIComponent(catSvg(""))
        .replace(/width="50".*?height="58"/, 'width="24" height="28"')
        .replace(/<text.*?<\/text>/, ''),
    }}
  />
);

const BuildingLegendIcon = () => (
  <div
    className="w-5 h-6"
    dangerouslySetInnerHTML={{
      __html: decodeURIComponent(buildingSvg("B"))
        .replace(/width="40".*?height="50"/, 'width="20" height="25"')
        .replace(/<text.*?<\/text>/, ''),
    }}
  />
);

/* ---------- HELPER: Style "Microwave" and "UC" ---------- */
const highlightText = (text: string): string => {
  return text
    .split(/(\s+|\u2022\s*)/) // Split on spaces and bullets
    .map(part => {
      const trimmed = part.trim();
      if (trimmed === "Microwave" || trimmed === "UC") {
        return `<strong style="font-weight:700; font-size:13px;">${trimmed}</strong>`;
      }
      return part;
    })
    .join("");
};

export default function MapWithEverything({ cats, buildings, onCatClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [zoom, setZoom] = useState(16);
  const markersRef = useRef<google.maps.Marker[]>([]);

  /* ---------- INIT MAP ---------- */
  useEffect(() => {
    if (!window.google?.maps || !mapRef.current) return;

    const gMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 32.7318, lng: -97.1115 },
      zoom: 16,
      styles: MAP_STYLES,
      restriction: { latLngBounds: UTA_BOUNDS, strictBounds: true },
      minZoom: 15,
      maxZoom: 18,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: "greedy",
    });

    gMap.addListener("zoom_changed", () => setZoom(gMap.getZoom() ?? 16));
    setMap(gMap);
  }, []);

  /* ---------- MARKERS ---------- */
  useEffect(() => {
    if (!map) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const items = [
      ...cats.map(cat => ({ type: 'cat' as const, data: cat, key: `cat-${cat.id}` })),
      ...buildings.map(b => ({ type: 'building' as const, data: b, key: `bld-${b.abbr}` }))
    ];

    const groups = new Map<string, typeof items>();
    items.forEach(item => {
      const key = `${item.data.lat.toFixed(6)},${item.data.lng.toFixed(6)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    });

    const radiusMeters = 25;
    const earthRadius = 6371000;

    groups.forEach((group, posKey) => {
      const [latStr, lngStr] = posKey.split(',');
      const baseLat = parseFloat(latStr);
      const baseLng = parseFloat(lngStr);

      group.forEach((item, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const distance = radiusMeters * (i + 1);
        const dLat = (distance * Math.cos(angle)) / earthRadius;
        const dLng = (distance * Math.sin(angle)) / (earthRadius * Math.cos(baseLat * Math.PI / 180));
        const newLat = baseLat + (dLat * 180 / Math.PI);
        const newLng = baseLng + (dLng * 180 / Math.PI);
        const position = { lat: newLat, lng: newLng };

        if (item.type === 'cat') {
          const cat = item.data as Cat;

          const marker = new google.maps.Marker({
            position,
            map,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${catSvg(cat.name)}`,
              scaledSize: new google.maps.Size(50, 58),
              anchor: new google.maps.Point(25, 58),
            },
            title: `${cat.name} – ${cat.activity}`,
          });

          // Build info window HTML with custom tail
          const activityHTML = highlightText(cat.activity);
          const favSpotHTML = highlightText(cat.favSpot);

          // const infoContent = `
          //   <div style="position: relative; padding-bottom: 12px;">
          //     <div style="
          //       padding:14px 16px;
          //       font-family:system-ui,-apple-system,sans-serif;
          //       background:linear-gradient(135deg, #FFFCF4 0%, #4E2A17  100%);
          //       border-radius:12px;
          //       box-shadow:0 4px 16px rgba(78,42,23,0.2);
          //       border:2px solid #4E2A17 ;
          //       min-width:200px;
          //       max-width:260px;
          //       font-size:14px;
          //       line-height:1.5;
          //       word-wrap:break-word;
          //       position: relative;
          //     ">
          //       <strong style="
          //         color:#4E2A17;
          //         font-size:17px;
          //         display:block;
          //         margin-bottom:4px;
          //         white-space:normal;
          //       ">${cat.name}</strong>

          //       <em style="
          //         color:#847570;
          //         font-size:13px;
          //         display:block;
          //         margin-bottom:6px;
          //         white-space:normal;
          //         background:#FFFCF4;
          //         padding:3px 7px;
          //         border-radius:6px;
          //         display:inline-block;
          //       ">${cat.color}</em>

          //       <span style="
          //         color:#4E2A17;
          //         font-size:12px;
          //         display:block;
          //         white-space:normal;
          //         line-height:1.5;
          //         margin-top:6px;
          //       ">
          //         ${activityHTML} • ${favSpotHTML}
          //       </span>
          //     </div>
          //     <!-- Custom tail pointer -->
          //     <div style="
          //       position: absolute;
          //       bottom: 0;
          //       left: 50%;
          //       transform: translateX(-50%);
          //       width: 0;
          //       height: 0;
          //       border-left: 10px solid transparent;
          //       border-right: 10px solid transparent;
          //       border-top: 12px solid #4E2A17 ;
          //     "></div>
          //   </div>
          // `;
          const infoContent = `
  <div style="position: relative; padding-bottom: 12px;">
    <div style="
      padding:14px 16px;
      font-family:'Poppins', 'Roboto', system-ui, -apple-system, sans-serif;
      background:#847570;
      border-radius:12px;
      box-shadow:0 4px 16px rgba(132, 117, 112, 0.3);
      border:2px solid #847570;
      min-width:200px;
      max-width:260px;
      font-size:14px;
      line-height:1.5;
      word-wrap:break-word;
      position: relative;
    ">
      <strong style="
        color:#FFFCF4;
        font-size:17px;
        display:block;
        margin-bottom:4px;
        white-space:normal;
        font-family:'Poppins', sans-serif;
      ">${cat.name}</strong>

      <em style="
        color:#FFFCF4;
        font-size:13px;
        display:block;
        margin-bottom:6px;
        white-space:normal;
        background:rgba(255, 252, 244, 0.15);
        padding:3px 7px;
        border-radius:6px;
        display:inline-block;
        font-family:'Roboto', sans-serif;
      ">${cat.color}</em>

      <span style="
        color:#FFFCF4;
        font-size:12px;
        display:block;
        white-space:normal;
        line-height:1.5;
        margin-top:6px;
        font-family:'Roboto', sans-serif;
      ">
        ${activityHTML} • ${favSpotHTML}
      </span>
    </div>
    <!-- Custom tail pointer -->
    <div style="
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 12px solid #847570;
    "></div>
  </div>
`;
          const info = new google.maps.InfoWindow({
            content: infoContent,
            pixelOffset: new google.maps.Size(0,-1),
            disableAutoPan: true,
          });

          // Remove default InfoWindow styling including border and tail
          google.maps.event.addListener(info, 'domready', () => {
            const iwOuter = document.querySelector('.gm-style-iw-c');
            const iwBackground = document.querySelector('.gm-style-iw-d');
            const iwCloseBtn = document.querySelector('.gm-ui-hover-effect');
            const iwTip = document.querySelector('.gm-style-iw-tc');
            
            if (iwOuter) {
              (iwOuter as HTMLElement).style.padding = '0';
              (iwOuter as HTMLElement).style.background = 'transparent';
              (iwOuter as HTMLElement).style.boxShadow = 'none';
              (iwOuter as HTMLElement).style.borderRadius = '0';
              (iwOuter as HTMLElement).style.overflow = 'visible';
              (iwOuter as HTMLElement).style.border = 'none';
              (iwOuter as HTMLElement).style.outline = 'none';
            }
            if (iwBackground) {
              (iwBackground as HTMLElement).style.overflow = 'visible';
              (iwBackground as HTMLElement).style.boxShadow = 'none';
            }
            if (iwCloseBtn) {
              (iwCloseBtn as HTMLElement).style.display = 'none';
            }
            // Hide default tail
            if (iwTip) {
              (iwTip as HTMLElement).style.display = 'none';
            }
            
            // Remove any parent container borders
            const iwContainer = document.querySelector('.gm-style-iw');
            if (iwContainer) {
              (iwContainer as HTMLElement).style.border = 'none';
              (iwContainer as HTMLElement).style.outline = 'none';
            }
          });

          marker.addListener("mouseover", () => info.open(map, marker));
          marker.addListener("mouseout", () => info.close());
          marker.addListener("click", () => {
            setSelectedCat(cat);
            onCatClick?.(cat);
          });

          markersRef.current.push(marker);
        } else {
          const b = item.data as Building;
          if (zoom < 16 && b.priority !== 1) return;

          const marker = new google.maps.Marker({
            position,
            map,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${buildingSvg(b.abbr)}`,
              scaledSize: new google.maps.Size(40, 50),
              anchor: new google.maps.Point(20, 50),
            },
            title: b.name,
          });
          markersRef.current.push(marker);
        }
      });
    });
  }, [map, cats, buildings, zoom, onCatClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />

      {/* LEGEND */}
      <div className="
        absolute bottom-4 right-4
        bg-white/95 backdrop-blur-sm rounded-lg shadow-xl
        p-3.5 text-sm font-medium text-gray-800
        space-y-2 border border-gray-100 z-10
      ">
        <div className="flex items-center gap-2.5">
          <CatLegendIcon />
          <span>Campus Cats</span>
        </div>
        <div className="flex items-center gap-2.5">
          <BuildingLegendIcon />
          <span>Buildings</span>
        </div>
      </div>

      {/* MODAL */}
      {selectedCat && (
        <CatProfileModal cat={selectedCat} onClose={() => setSelectedCat(null)} />
      )}
    </div>
  );
}