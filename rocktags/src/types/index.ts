export interface Cat {
  id: number;
  name: string;
  lat: number;
  lng: number;
  color: string;
  personality: string;
  activity: string;
  age: number;
  friendliness: number;
  favSpot: string;
  bio: string;
  sightings: number;
  bestTime: string;
}

export interface Building {
  name: string;
  abbr: string;
  lat: number;
  lng: number;
  priority: number;
}