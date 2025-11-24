// src/app/GoogleMapsLoader.tsx
"use client";

import { useEffect } from "react";

export default function GoogleMapsLoader() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.maps) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}