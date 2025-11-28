/**
 * API Route: Proxy for Tracker API
 * This acts as a bridge between frontend and backend to handle CORS issues
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📤 Received tracker request body:", body);
    console.log("📤 Body type:", Array.isArray(body) ? "array" : typeof body);

    // Expected format: { trackers: [...] }
    let trackers = [];
    
    if (Array.isArray(body)) {
      // If we received just an array, wrap it
      trackers = body;
      console.log("📤 Wrapped array as trackers");
    } else if (body.trackers && Array.isArray(body.trackers)) {
      // If we received { trackers: [...] }, use it as is
      trackers = body.trackers;
      console.log("📤 Using trackers from body.trackers");
    }
    
    console.log("📤 Extracted trackers:", trackers);
    console.log("📤 Trackers count:", trackers.length);
    if (trackers.length > 0) {
      console.log("📤 First tracker:", trackers[0]);
    }

    const backendUrl = process.env.NEXT_PUBLIC_TRACKER_API_URL || 
      "https://rocktags-backend-147809513475.us-south1.run.app/findmy/";
    
    console.log("📡 Forwarding to backend:", backendUrl);
    
    // Send in the correct format: { trackers: [...] }
    const requestBody = { trackers };
    console.log("📤 Request body being sent:", JSON.stringify(requestBody));

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
      console.error(`❌ Backend error ${response.status}:`, errorText);
      return Response.json(
        { error: `Tracker API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Backend response data:", data);
    return Response.json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return Response.json(
      { error: "Failed to fetch tracker data" },
      { status: 500 }
    );
  }
}
