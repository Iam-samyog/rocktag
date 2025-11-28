/**
 * Tracker API Service
 * Fetches real-time cat location data from the backend
 */

const TRACKER_API_URL = "https://rocktags-backend-147809513475.us-south1.run.app/findmy/";

export interface TrackerRequest {
  name: string;
  privateKey: string;
}

export interface TrackerLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  status: number;
}

export interface TrackerResponse {
  [catName: string]: TrackerLocation;
}

/**
 * Fetch real-time locations for tracked cats
 * @param trackers - Array of cat trackers with name and privateKey
 * @returns Object with cat names as keys and location data as values
 */
export async function fetchTrackerLocations(
  trackers: TrackerRequest[]
): Promise<TrackerResponse> {
  try {
    const response = await fetch(TRACKER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackers }),
    });

    if (!response.ok) {
      throw new Error(`Tracker API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch tracker locations:", error);
    throw error;
  }
}

/**
 * Build tracker requests from cat data
 * You'll need to get privateKey from your database or config
 */
export function buildTrackerRequests(cats: Array<{ name: string; privateKey?: string }>): TrackerRequest[] {
  return cats
    .filter((cat) => cat.privateKey) // Only include cats with private keys
    .map((cat) => ({
      name: cat.name,
      privateKey: cat.privateKey!,
    }));
}
