import { scrapeWebsiteData } from "../lib/scraper.js";
import { azrielKnowledgeBase } from "../lib/knowledge-base.js";

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
      portfolio: azrielKnowledgeBase.personal,
      server: "Azriel Portfolio Chatbot API v5.0 - Vercel Serverless",
      status: "Active",
      features: {
        serverlessDeployment: "Global edge network deployment",
        cleanTextResponse: "No HTML formatting issues",
        realTimeData: "Website scraping dengan caching",
        fallbackSupport: "Smart context-based fallbacks",
        globalCDN: "Worldwide low-latency access",
      },
      websiteData: {
        title: websiteData.title,
        technologies: websiteData.technologies,
        lastUpdated: websiteData.lastScraped,
      },
      platform: "Vercel Serverless Functions",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch complete info",
      basicInfo: azrielKnowledgeBase.personal,
      platform: "Vercel Serverless Functions",
    });
  }
}
