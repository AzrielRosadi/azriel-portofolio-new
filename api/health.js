// api/health.js - Health Check Endpoint
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["GET"],
    });
  }

  try {
    // Simple health check
    const healthData = {
      status: "OK",
      message: "Azriel Portfolio Chatbot API is running",
      timestamp: new Date().toISOString(),
      version: "3.0.0 Vercel",
      features: [
        "Enhanced response formatting",
        "Real-time website scraping",
        "Structured AI responses",
        "Professional styling",
        "Mobile responsive design",
        "Vercel serverless deployment",
      ],
      endpoints: {
        chat: "/api/chat",
        health: "/api/health",
        info: "/api/info",
      },
      environment: {
        platform: "Vercel",
        runtime: "Node.js",
        region: process.env.VERCEL_REGION || "unknown",
      },
    };

    // Check if Gemini API key is configured
    const geminiConfigured = !!process.env.GEMINI_API_KEY;
    healthData.services = {
      gemini: geminiConfigured ? "configured" : "not configured",
      websiteScraping: "active",
      fallbackResponses: "active",
    };

    res.status(200).json(healthData);
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
