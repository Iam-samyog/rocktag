/**
 * API Route: Proxy for Tracker API
 * This acts as a bridge between frontend and backend to handle CORS issues
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📤 Received tracker request body:", body);
    console.log("📤 Body type:", Array.isArray(body) ? "array" : typeof body);

    // Body should be the trackers array directly
    const trackers = Array.isArray(body) ? body : body.trackers || [];
    console.log("📤 Extracted trackers:", trackers);
    console.log("📤 Trackers count:", trackers.length);
    console.log("📤 First tracker:", trackers[0]);

    const backendUrl = process.env.NEXT_PUBLIC_TRACKER_API_URL || 
      "https://rocktags-backend-147809513475.us-south1.run.app/findmy/";
    
    console.log("📡 Forwarding to backend:", backendUrl);
    
    // Try sending as array first, then wrapped in object if needed
    let requestBody = JSON.stringify(trackers);
    console.log("📤 Request body being sent:", requestBody);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
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
