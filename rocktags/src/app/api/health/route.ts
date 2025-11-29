/**
 * Health Check Endpoint
 * Monitors API and backend service availability
 * 
 * Usage: GET /api/health
 * Returns: { status: "healthy" | "unhealthy", backend: "up" | "down", timestamp: string }
 */

export async function GET() {
  try {
    const startTime = Date.now();
    const backendUrl = process.env.NEXT_PUBLIC_TRACKER_API_URL || 
      "https://rocktags-backend-147809513475.us-south1.run.app/findmy/";
    
    console.log("🏥 Health check started");

    // Test backend connectivity with 5-second timeout
    let backendStatus: "up" | "down" = "down";
    let backendLatency = -1;
    let backendError = "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const backendStart = Date.now();
      const backendResponse = await fetch(backendUrl, {
        method: "HEAD",
        signal: controller.signal,
      });
      backendLatency = Date.now() - backendStart;
      clearTimeout(timeoutId);

      backendStatus = backendResponse.ok ? "up" : "down";
      console.log(`📡 Backend status: ${backendStatus} (latency: ${backendLatency}ms)`);
    } catch (error) {
      backendError = error instanceof Error ? error.message : "Unknown error";
      console.warn(`⚠️ Backend unreachable: ${backendError}`);
    }

    const apiLatency = Date.now() - startTime;
    const overallStatus = backendStatus === "up" ? "healthy" : "degraded";

    const response = {
      status: overallStatus,
      backend: backendStatus,
      apiLatency: `${apiLatency}ms`,
      backendLatency: backendLatency > 0 ? `${backendLatency}ms` : "timeout",
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasTrackerKey: Boolean(process.env.CAT1_TRACKER_KEY),
      },
    };

    console.log("✅ Health check complete:", response);

    return Response.json(response, {
      status: overallStatus === "healthy" ? 200 : 503,
    });
  } catch (error) {
    console.error("❌ Health check failed:", error);

    return Response.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

/**
 * Allow OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return Response.json({ ok: true });
}
