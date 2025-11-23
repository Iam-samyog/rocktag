// Type definitions for CatMap app
// Generated from structures in `app/page.js` (campusCats, allBuildings, map options)

export type LatLng = { lat: number; lng: number };

/**
 * Core cat data – everything that exists in the original map.
 */
export type Cat = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  color: string;
  personality: string;
  activity: string;
  age: number;
  friendliness: number; // 1-5
  favSpot: string;
  bio: string;
  sightings: number;
  bestTime: string;

  /* --------------------------------------------------------------
     NEW OPTIONAL fields used only by the profile modal
     -------------------------------------------------------------- */
  /** URL of the cat’s main portrait (fallback handled in UI) */
  profileImage?: string;

  /** List of personality-trait strings (e.g. ["playful", "cuddly"]) */
  traits?: string[];

  /** Where the cat loves to be rubbed – shown only if present */
  favoriteRubbingPlace?: string;

  /** Gallery images – array of URLs */
  gallery?: string[];
};

export type Building = {
  name: string;
  abbr: string;
  lat: number;
  lng: number;
  priority: number; // 1..3
};

export type MapIcon = {
  url: string;
  scaledSize?: { width: number; height: number };
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type MapOptionsShape = {
  styles?: any[];
  restriction?: { latLngBounds: MapBounds; strictBounds?: boolean };
  minZoom?: number;
  maxZoom?: number;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
  zoomControl?: boolean;
  gestureHandling?: "greedy" | "cooperative" | "none" | "auto";
};

export type Cats = Cat[];
export type Buildings = Building[];

// Example defaults (handy for quick imports)
export const defaultCenter: LatLng = { lat: 32.7318, lng: -97.1115 };

/*

Usage example in a TypeScript/TSX file:

import type { Cat, Building, MapOptionsShape } from './types';

function doSomething(cat: Cat) {
  console.log(cat.name, cat.lat, cat.lng);
}

*/