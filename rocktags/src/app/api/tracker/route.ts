/**
 * API Route: Proxy for Tracker API
 * This acts as a bridge between frontend and backend to handle CORS issues
 * 
 * NOTE: If backend returns 500 error, the cat will display at static position
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📤 Received tracker request");

    // Expected format: { trackers: [...] }
    let trackers: any[] = [];
    
    if (Array.isArray(body)) {
      // If we received just an array, wrap it
      trackers = body;
      console.log("📤 Wrapped array as trackers");
    } else if (body.trackers && Array.isArray(body.trackers)) {
      // If we received { trackers: [...] }, use it as is
      trackers = body.trackers;
      console.log("📤 Using trackers from body.trackers");
    }
    
    console.log("📤 Trackers count:", trackers.length);
    if (trackers.length > 0) {
      // Don't log sensitive privateKey data
      console.log("📤 Tracker names:", trackers.map((t: any) => t.name));
    }

    const backendUrl = process.env.NEXT_PUBLIC_TRACKER_API_URL || 
      "https://rocktags-backend-147809513475.us-south1.run.app/findmy/";
    
    console.log("📡 Forwarding to backend:", backendUrl);
    
    // Send in the correct format: { trackers: [...] }
    const requestBody = { trackers };
    // Don't log the full request body as it contains sensitive privateKey
    console.log("📤 Sending request with", trackers.length, "tracker(s)");

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📥 Backend response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`⚠️ Backend error ${response.status}:`, errorText);
      
      // If backend fails, return empty object so map uses static data
      console.warn("⚠️ Backend unavailable - returning empty response to use static cat positions");
      return Response.json({}, { status: 200 });
    }

    const data = await response.json();
    console.log("✅ Backend response received");
    return Response.json(data);
  } catch (error) {
    console.error("⚠️ Proxy error:", error);
    // Return empty object on error so map uses static data
    console.warn("⚠️ Returning empty response to use static cat positions");
    return Response.json({}, { status: 200 });
  }
}
