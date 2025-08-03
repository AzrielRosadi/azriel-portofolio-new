import { scrapeWebsiteData } from "../lib/scraper.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const websiteData = await scrapeWebsiteData();
    res.json({
      status: "OK",
      message: "Azriel Portfolio Chatbot Server is running",
      version: "5.0.0 - Vercel Serverless",
      features: [
        "Serverless deployment",
        "Clean text responses",
        "Real-time website scraping",
        "No HTML formatting issues",
        "Enhanced fallback support",
        "Edge network optimization",
      ],
      websiteStatus: {
        accessible: !websiteData.error,
        lastScraped: websiteData.lastScraped,
        technologiesFound: websiteData.technologies?.length || 0,
      },
      platform: "Vercel Serverless Functions",
    });
  } catch (error) {
    res.json({
      status: "OK",
      message: "Server running but website scraping unavailable",
      error: error.message,
      platform: "Vercel Serverless Functions",
    });
  }
}
