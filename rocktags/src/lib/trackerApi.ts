/**
 * Tracker API Service
 * Fetches real-time cat location data from the backend via API proxy
 */

// Use the local API proxy to avoid CORS issues
const TRACKER_API_URL = "/api/tracker";

const TRACKER_TIMEOUT = 
  parseInt(process.env.NEXT_PUBLIC_TRACKER_TIMEOUT || "10000");

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
    console.log("Fetching tracker locations from:", TRACKER_API_URL);
    console.log("Sending trackers:", trackers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TRACKER_TIMEOUT);

    const response = await fetch(TRACKER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackers),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(`Tracker API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Tracker API response:", data);
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error - API may be unreachable:", error);
      console.warn("CORS or network connectivity issue detected");
    } else {
      console.error("Failed to fetch tracker locations:", error);
    }
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
