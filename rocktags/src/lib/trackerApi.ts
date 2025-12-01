/**
 * Tracker API Service
 * Fetches real-time cat location data from the backend via API proxy
 * 
 * Features:
 * - Request caching (5-second TTL)
 * - Retry logic with exponential backoff
 * - Timeout protection
 * - Bounds validation (checks if location is within UTA campus)
 */

// Use the local API proxy to avoid CORS issues
const TRACKER_API_URL = "/api/tracker";

const TRACKER_TIMEOUT = 
  parseInt(process.env.NEXT_PUBLIC_TRACKER_TIMEOUT || "10000");

// UTA Campus Bounds (approximate geofence around UTA Arlington campus)
// These values are based on the coordinates in campus-data.json
const UTA_BOUNDS = {
  minLat: 32.7270,  // South boundary
  maxLat: 32.7400,  // North boundary
  minLng: -97.1250, // West boundary
  maxLng: -97.1050, // East boundary
};

/**
 * Validate if a location is within UTA campus bounds
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns true if location is within bounds, false otherwise
 */
function isWithinUTABounds(lat: number, lng: number): boolean {
  return (
    lat >= UTA_BOUNDS.minLat &&
    lat <= UTA_BOUNDS.maxLat &&
    lng >= UTA_BOUNDS.minLng &&
    lng <= UTA_BOUNDS.maxLng
  );
}

// Cache configuration
const CACHE_DURATION = 5000; // 5 seconds
interface CacheEntry {
  data: TrackerResponse;
  timestamp: number;
}
const locationCache = new Map<string, CacheEntry>();

export interface TrackerRequest {
  name: string;
  // privateKey is now stored server-side only
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
 * Generate cache key from tracker names
 */
function getCacheKey(trackers: TrackerRequest[]): string {
  return trackers
    .map(t => t.name)
    .sort()
    .join(',');
}

/**
 * Get cached tracker locations if still fresh
 */
function getCachedLocations(trackers: TrackerRequest[]): TrackerResponse | null {
  const cacheKey = getCacheKey(trackers);
  const cached = locationCache.get(cacheKey);
  
  if (!cached) return null;
  
  const age = Date.now() - cached.timestamp;
  if (age > CACHE_DURATION) {
    console.log(`⏱️ Cache expired after ${age}ms`);
    locationCache.delete(cacheKey);
    return null;
  }
  
  console.log(`✅ Using cached tracker locations (age: ${age}ms)`);
  return cached.data;
}

/**
 * Store tracker locations in cache
 */
function setCachedLocations(trackers: TrackerRequest[], data: TrackerResponse): void {
  const cacheKey = getCacheKey(trackers);
  locationCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
  console.log(`💾 Cached tracker locations`);
}

/**
 * Fetch real-time locations for tracked cats with retry logic and caching
 * @param trackers - Array of cat trackers with name
 * @returns Object with cat names as keys and location data as values
 */
export async function fetchTrackerLocations(
  trackers: TrackerRequest[]
): Promise<TrackerResponse> {
  try {
    console.log("🔄 Fetching tracker locations from:", TRACKER_API_URL);
    console.log("📋 Trackers count:", trackers.length);
    console.log("📋 Tracker names:", trackers.map(t => t.name));

    // Check cache first
    const cached = getCachedLocations(trackers);
    if (cached) {
      return cached;
    }

    // Fetch with retry logic
    const data = await fetchWithRetry(trackers);
    
    // Cache the successful response
    if (Object.keys(data).length > 0) {
      setCachedLocations(trackers, data);
    }
    
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("⚠️ Network error - API may be unreachable:", error);
      console.warn("⚠️ CORS or network connectivity issue detected - using static cat positions");
    } else {
      console.error("⚠️ Failed to fetch tracker locations:", error);
      console.warn("⚠️ Using static cat positions as fallback");
    }
    // Return empty object so map uses static positions
    return {};
  }
}

/**
 * Fetch tracker locations with retry logic and exponential backoff
 * @param trackers - Array of cat trackers
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @param baseDelay - Base delay in ms for exponential backoff (default: 100)
 * @returns Tracker response data
 */
async function fetchWithRetry(
  trackers: TrackerRequest[],
  maxRetries: number = 2,
  baseDelay: number = 100
): Promise<TrackerResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 API request attempt ${attempt + 1}/${maxRetries + 1}`);
      return await fetchTrackerLocationsOnce(trackers);
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`⚠️ Attempt ${attempt + 1} failed: ${lastError.message}`);
        console.log(`🔄 Retrying in ${delay}ms...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error(`❌ All ${maxRetries + 1} attempts failed`);
      }
    }
  }

  // All retries failed
  if (lastError) {
    throw lastError;
  }
  
  return {};
}

/**
 * Single attempt to fetch tracker locations
 */
async function fetchTrackerLocationsOnce(
  trackers: TrackerRequest[]
): Promise<TrackerResponse> {
  const requestBody = { trackers };
  console.log("📋 Sending request with", trackers.length, "tracker(s)");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRACKER_TIMEOUT);

  try {
    const response = await fetch(TRACKER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`⚠️ API Error ${response.status}:`, errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Tracker API response:", data);
    
    // Validate each location is within UTA bounds
    const validatedData: TrackerResponse = {};
    let hasOutOfBoundsLocations = false;
    
    Object.entries(data).forEach(([catName, location]) => {
      const trackerLoc = location as TrackerLocation;
      
      if (isWithinUTABounds(trackerLoc.latitude, trackerLoc.longitude)) {
        validatedData[catName] = trackerLoc;
      } else {
        hasOutOfBoundsLocations = true;
      }
    });
    
    // Log consolidated message - only once per fetch cycle
    if (Object.keys(data).length === 0) {
      // Backend returned no data
      console.warn("⚠️ Backend is DOWN - no tracker data received. Using static cat positions");
    } else if (Object.keys(validatedData).length === 0 && hasOutOfBoundsLocations) {
      // All locations are out of bounds
      console.warn("⚠️ All tracker locations are OUT OF BOUNDS - using static cat positions");
    } else if (Object.keys(validatedData).length > 0) {
      // At least some valid locations
      const validCats = Object.keys(validatedData).join(", ");
      console.log(`✅ Valid tracker locations: ${validCats}`);
    }
    
    return validatedData;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Build tracker requests from cat data
 * Note: privateKey is now stored server-side only, never sent from client
 */
export function buildTrackerRequests(cats: Array<{ name: string }>): TrackerRequest[] {
  return cats.map((cat) => ({
    name: cat.name,
    // privateKey is injected server-side in the API route
  }));
}
