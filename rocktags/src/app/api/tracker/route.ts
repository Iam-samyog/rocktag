/**
 * API Route: Proxy for Tracker API
 * This acts as a bridge between frontend and backend to handle CORS issues
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received tracker request:", body);

    // Extract trackers array from the request body
    const trackers = body.trackers || [];
    console.log("Forwarding trackers to backend:", trackers);

    const response = await fetch(
      process.env.NEXT_PUBLIC_TRACKER_API_URL || 
      "https://rocktags-backend-147809513475.us-south1.run.app/findmy/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the trackers array directly to the backend
        body: JSON.stringify(trackers),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error ${response.status}:`, errorText);
      return Response.json(
        { error: `Tracker API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Backend response:", data);
    return Response.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return Response.json(
      { error: "Failed to fetch tracker data" },
      { status: 500 }
    );
  }
}
