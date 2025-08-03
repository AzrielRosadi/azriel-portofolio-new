import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// FIXED: Simple text formatter - NO HTML TAGS
const cleanTextResponse = (rawResponse) => {
  if (!rawResponse || typeof rawResponse !== "string") {
    return rawResponse;
  }

  let cleanedResponse = rawResponse;

  // Remove any HTML tags that might be in the response
  cleanedResponse = cleanedResponse.replace(/<[^>]*>/g, "");

  // Clean up excessive whitespace
  cleanedResponse = cleanedResponse.replace(/\n{3,}/g, "\n\n");
  cleanedResponse = cleanedResponse.replace(/\s{3,}/g, " ");

  // Keep basic formatting characters
  cleanedResponse = cleanedResponse.trim();

  return cleanedResponse;
};

// Knowledge base for fallback
const azrielKnowledgeBase = {
  personal: {
    name: "Azriel Rosadi",
    title: "Web Developer & 3D Enthusiast",
    website: "https://azrl-webdev.vercel.app/",
    email: "azrlwebdev@gmail.com",
    currentRole: "Front-End Developer Intern at Starspace Studio",
    expertise: [
      "React.js",
      "Next.js",
      "Three.js",
      "Laravel",
      "Node.js",
      "PostgreSQL",
    ],
    projects: "25+ completed projects",
    specialization: "Interactive 3D Web Experiences",
  },
};

// Website data cache
let websiteDataCache = {
  data: null,
  lastUpdated: null,
  isValid: function () {
    if (!this.data || !this.lastUpdated) return false;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - this.lastUpdated < fiveMinutes;
  },
};

// FIXED: Simplified scraping function
async function scrapeWebsiteData() {
  try {
    if (websiteDataCache.isValid()) {
      console.log("📦 Using cached website data");
      return websiteDataCache.data;
    }

    console.log(
      "🔍 Scraping website data from:",
      azrielKnowledgeBase.personal.website
    );

    const response = await axios.get(azrielKnowledgeBase.personal.website, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AzrielBot/1.0)",
      },
    });

    const $ = cheerio.load(response.data);

    const scrapedData = {
      title: $("title").text() || "Azriel Rosadi Portfolio",
      technologies: [],
      lastScraped: new Date().toISOString(),
    };

    // Extract technology keywords
    const techKeywords = [
      "React",
      "Next.js",
      "Three.js",
      "JavaScript",
      "TypeScript",
      "Laravel",
      "Node.js",
      "PostgreSQL",
      "MySQL",
      "Tailwind",
      "GSAP",
    ];

    const pageText = $("body").text().toLowerCase();
    techKeywords.forEach((tech) => {
      if (pageText.includes(tech.toLowerCase())) {
        scrapedData.technologies.push(tech);
      }
    });

    // Cache the data
    websiteDataCache.data = scrapedData;
    websiteDataCache.lastUpdated = Date.now();

    console.log("✅ Website data cached successfully");
    return scrapedData;
  } catch (error) {
    console.error("❌ Error scraping website:", error.message);
    return {
      title: "Azriel Rosadi - Web Developer Portfolio",
      technologies: ["React", "Three.js", "JavaScript", "Laravel", "Node.js"],
      error: error.message,
      lastScraped: new Date().toISOString(),
    };
  }
}

// FIXED: Simplified context generator
const generateContextualPrompt = async (userMessage) => {
  const message = userMessage.toLowerCase();
  let contextualInfo = "";
  const websiteData = await scrapeWebsiteData();

  if (
    message.includes("proyek") ||
    message.includes("project") ||
    message.includes("portfolio")
  ) {
    contextualInfo = `
SPESIALISASI UTAMA AZRIEL:
• Interactive 3D web experiences dengan Three.js dan WebGL
• Modern responsive web applications dengan React.js/Next.js
• Fullstack development dengan Laravel dan Node.js
• E-commerce platforms dengan secure payment integration

STATISTIK PROFESIONAL:
• Total Projects: 25+ completed
• Client Satisfaction: 95%
• Technologies: ${websiteData.technologies.join(", ")}
• Specialization: 3D Interactive Web Development
    `;
  }

  if (
    message.includes("teknologi") ||
    message.includes("tech") ||
    message.includes("skill")
  ) {
    contextualInfo = `
TECH STACK AZRIEL:

FRONTEND EXCELLENCE:
• React.js, Next.js, TypeScript, JavaScript ES6+
• Three.js untuk 3D web experiences
• GSAP & Framer Motion untuk animations
• Tailwind CSS, SCSS untuk styling

BACKEND & DATABASE:
• Node.js dengan Express.js untuk APIs
• Laravel dengan PHP untuk web applications
• PostgreSQL & MySQL untuk data management

TEKNOLOGI DARI WEBSITE: ${websiteData.technologies.join(", ")}
    `;
  }

  if (
    message.includes("kontak") ||
    message.includes("contact") ||
    message.includes("hire")
  ) {
    contextualInfo = `
KONTAK & COLLABORATION:

Email: azrlwebdev@gmail.com
Website: https://azrl-webdev.vercel.app/
Response Time: Usually within 24 hours

AVAILABLE SERVICES:
• Custom Web Development (mulai dari $300)
• 3D Interactive Experiences ($1200-2000)
• E-commerce Solutions ($800-1500)
• Fullstack Applications ($1000-2500)

Status: Available untuk new projects
    `;
  }

  return contextualInfo;
};

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://azrl-webdev.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// FIXED: Main chat endpoint - Clean text only
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("💬 Received message:", message.substring(0, 50) + "...");

    // Generate contextual information
    const contextualInfo = await generateContextualPrompt(message);
    const websiteData = await scrapeWebsiteData();

    // FIXED: Simplified system prompt for clean text response
    const systemPrompt = `Anda adalah AI Assistant profesional untuk portfolio Azriel Rosadi, Web Developer & 3D Enthusiast.

INFORMASI AZRIEL:
- Name: Azriel Rosadi
- Role: Front-End Developer Intern at Starspace Studio
- Website: https://azrl-webdev.vercel.app/
- Email: azrlwebdev@gmail.com
- Expertise: React.js, Three.js, Laravel, Node.js, PostgreSQL
- Projects: 25+ completed projects dengan 95% client satisfaction
- Specialization: Interactive 3D Web Experiences

WEBSITE DATA (Real-time):
Title: ${websiteData.title}
Technologies: ${websiteData.technologies.join(", ")}
Last Updated: ${websiteData.lastScraped}

${contextualInfo}

INSTRUCTIONS:
1. Jawab dalam bahasa Indonesia yang ramah dan profesional
2. Gunakan emoji secukupnya untuk engagement (🚀, 💻, 📊, ✨)
3. Berikan informasi konkret tentang keahlian Azriel
4. Format response dengan line breaks untuk readability
5. JANGAN gunakan HTML tags, bold markdown, atau formatting markup
6. Berikan jawaban yang informatif dan actionable
7. Highlight 3D web development expertise
8. Sertakan contact info jika relevan

RESPONSE FORMAT:
- Sapaan yang warm
- Informasi utama dengan emoji bullets
- Detail konkret dan statistics
- Call-to-action yang jelas
- PLAIN TEXT ONLY - NO HTML/MARKDOWN FORMATTING

Berikan response yang engaging dan informatif!`;

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Question: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "❌ Gemini API Error:",
        response.status,
        response.statusText
      );
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    // FIXED: Clean text response only
    let rawResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi atau hubungi langsung melalui email azrlwebdev@gmail.com";

    // Apply text cleaning
    let aiResponse = cleanTextResponse(rawResponse);

    console.log("✅ Clean text response generated successfully");

    res.json({
      response: aiResponse,
      metadata: {
        websiteLastScraped: websiteData.lastScraped,
        technologiesFound: websiteData.technologies.length,
        cleaned: true,
        responseLength: aiResponse.length,
      },
    });
  } catch (error) {
    console.error("❌ Error in chat endpoint:", error);

    // FIXED: Clean fallback responses
    const message = req.body.message?.toLowerCase() || "";
    let fallbackResponse = "";

    if (message.includes("proyek") || message.includes("project")) {
      fallbackResponse = `🚀 PORTFOLIO AZRIEL ROSADI

Spesialisasi:
🔸 Interactive 3D web experiences dengan Three.js
🔸 Modern web applications dengan React/Next.js
🔸 E-commerce platforms dengan secure payment
🔸 Fullstack development dengan Laravel & Node.js

Statistics:
🔸 25+ completed projects
🔸 95% client satisfaction rate
🔸 15+ technologies mastered

🌐 Explore website: https://azrl-webdev.vercel.app/`;
    } else if (message.includes("kontak") || message.includes("contact")) {
      fallbackResponse = `📞 HUBUNGI AZRIEL

✉️ Email: azrlwebdev@gmail.com
🌐 Website: https://azrl-webdev.vercel.app/
📱 Response Time: Usually within 24 hours

💼 Available Services:
🔸 Custom Web Development ($300-2500)
🔸 3D Interactive Experiences ($1200-2000)
🔸 E-commerce Solutions ($800-1500)
🔸 Fullstack Applications ($1000-2500)

🤝 Status: Available untuk new projects dan collaborations`;
    } else {
      fallbackResponse = `🌟 AZRIEL ROSADI - WEB DEVELOPER & 3D ENTHUSIAST

💻 Expertise:
🔸 React.js, Next.js, Three.js
🔸 Laravel, Node.js, PostgreSQL
🔸 3D Web Development
🔸 Interactive UI/UX

📊 Experience:
🔸 Front-End Developer Intern di Starspace Studio
🔸 25+ completed projects
🔸 95% client satisfaction

📞 Contact: azrlwebdev@gmail.com
🌐 Website: https://azrl-webdev.vercel.app/`;
    }

    res.status(500).json({
      error: "Internal server error",
      response: fallbackResponse,
      fallback: true,
      cleaned: true,
    });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const websiteData = await scrapeWebsiteData();
    res.json({
      status: "OK",
      message: "Azriel Portfolio Chatbot Server is running",
      version: "4.0.0 - Clean Text",
      features: [
        "Clean text responses",
        "Real-time website scraping",
        "No HTML formatting issues",
        "Enhanced fallback support",
        "Efficient caching system",
      ],
      websiteStatus: {
        accessible: !websiteData.error,
        lastScraped: websiteData.lastScraped,
        technologiesFound: websiteData.technologies?.length || 0,
      },
      uptime: process.uptime(),
    });
  } catch (error) {
    res.json({
      status: "OK",
      message: "Server running but website scraping unavailable",
      error: error.message,
    });
  }
});

// Info endpoint
app.get("/api/info", async (req, res) => {
  try {
    const websiteData = await scrapeWebsiteData();
    res.json({
      portfolio: azrielKnowledgeBase.personal,
      server: "Azriel Portfolio Chatbot API v4.0 - Clean Text",
      status: "Active",
      features: {
        cleanTextResponse: "No HTML formatting issues",
        realTimeData: "Website scraping dengan caching",
        fallbackSupport: "Smart context-based fallbacks",
        efficientCache: "5-minute intelligent caching",
      },
      websiteData: {
        title: websiteData.title,
        technologies: websiteData.technologies,
        lastUpdated: websiteData.lastScraped,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch complete info",
      basicInfo: azrielKnowledgeBase.personal,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("💥 Unhandled error:", err.stack);

  const errorResponse = `🚨 System Error

Maaf, terjadi kesalahan teknis. Tim Azriel sedang memperbaikinya!

📞 Alternative Contact:
✉️ Email: azrlwebdev@gmail.com  
🌐 Website: https://azrl-webdev.vercel.app/`;

  res.status(500).json({
    error: "Something went wrong!",
    response: errorResponse,
    timestamp: new Date().toISOString(),
    cleaned: true,
  });
});

// Server startup
app.listen(PORT, async () => {
  console.log(
    `🚀 Azriel Portfolio Chatbot Server v4.0 - Clean Text running on port ${PORT}`
  );
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
  console.log(`💬 FIXED: Clean text responses without HTML formatting issues`);
  console.log(`📊 Portfolio data for: ${azrielKnowledgeBase.personal.website}`);

  // Initial website data load
  console.log(`🔄 Loading initial website data...`);
  try {
    const initialData = await scrapeWebsiteData();
    console.log(
      `✅ Website data loaded: ${initialData.technologies.length} technologies found`
    );
  } catch (error) {
    console.log(`⚠️  Website scraping failed on startup: ${error.message}`);
  }

  console.log(`\n🎯 FIXED Features:`);
  console.log(`   ✅ Clean text responses - NO HTML tags`);
  console.log(`   ✅ Proper line breaks and formatting`);
  console.log(`   ✅ Enhanced emoji usage for engagement`);
  console.log(`   ✅ Real-time website data integration`);
  console.log(`   ✅ Smart context-based responses`);
  console.log(`   ✅ Comprehensive fallback support`);
  console.log(`   ✅ 5-minute intelligent caching system`);
  console.log(`   ✅ Simplified response processing`);
  console.log(`\n📱 Available endpoints:`);
  console.log(`   POST /api/chat - Main chatbot interface (FIXED)`);
  console.log(`   GET  /api/health - Server health check`);
  console.log(`   GET  /api/info - Portfolio information`);
  console.log(`\n🐛 BUG FIXES:`);
  console.log(`   • Removed complex HTML formatting function`);
  console.log(`   • Clean text-only responses`);
  console.log(`   • Proper emoji and line break handling`);
  console.log(`   • No more HTML tags in chat messages`);
  console.log(`   • Simplified response processing`);
  console.log(`\n🎯 Ready to serve CLEAN chatbot responses!`);
});
