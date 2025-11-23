// Type definitions for CatMap app
// Generated from structures in `app/page.js` (campusCats, allBuildings, map options)

export type LatLng = { lat: number; lng: number };

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
