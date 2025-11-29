/**
 * API Route: Proxy for Tracker API
 * This acts as a bridge between frontend and backend to handle CORS issues
 * 
 * Features:
 * - Request validation with Zod
 * - Rate limiting awareness
 * - Graceful error handling
 * 
 * NOTE: Private keys are stored here server-side only
 * NOTE: If backend returns 500 error, the cat will display at static position
 */

import { z } from 'zod';

// Validation schemas
const TrackerRequestSchema = z.object({
  name: z.string()
    .min(1, "Tracker name cannot be empty")
    .max(50, "Tracker name too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Tracker name contains invalid characters"),
});

const RequestBodySchema = z.object({
  trackers: z.array(TrackerRequestSchema)
    .min(1, "At least one tracker required")
    .max(50, "Too many trackers requested"),
});

// Server-side tracker configuration with private keys
// These keys NEVER reach the client
const TRACKER_KEYS: Record<string, string> = {
  cat1: process.env.CAT1_TRACKER_KEY || "E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg==",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📤 Received tracker request");

    // Validate request body
    let validatedBody: z.infer<typeof RequestBodySchema>;
    try {
      validatedBody = RequestBodySchema.parse(body);
      console.log("✅ Request validation passed");
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.warn("⚠️ Request validation failed:", validationError.issues);
        return Response.json(
          { 
            error: "Invalid request format",
            details: validationError.issues 
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const trackers = validatedBody.trackers;
    console.log("📤 Trackers count:", trackers.length);
    console.log("📤 Tracker names:", trackers.map((t) => t.name));

    // Inject private keys server-side (client never sees them)
    const trackersWithKeys = trackers
      .map((t) => ({
        name: t.name,
        privateKey: TRACKER_KEYS[t.name],
      }))
      .filter((t): t is { name: string; privateKey: string } => Boolean(t.privateKey)); // Only include trackers we have keys for

    if (trackersWithKeys.length === 0) {
      console.warn("⚠️ No trackers with configured keys");
      return Response.json({}, { status: 200 });
    }

    console.log("📤 Prepared", trackersWithKeys.length, "tracker(s) with keys for backend");

    const backendUrl = process.env.NEXT_PUBLIC_TRACKER_API_URL || 
      "https://rocktags-backend-147809513475.us-south1.run.app/findmy/";
    
    console.log("📡 Forwarding to backend:", backendUrl);
    
    // Send in the correct format: { trackers: [...] } with private keys
    const requestBody = { trackers: trackersWithKeys };
    // Don't log the full request body as it contains privateKeys
    console.log("📤 Sending request with", trackersWithKeys.length, "tracker(s)");

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
