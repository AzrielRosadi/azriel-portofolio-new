import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const router = express.Router();

// Knowledge base singkat untuk fallback
const quickKnowledgeBase = {
  name: "Azriel Rosadi",
  title: "Web Developer & 3D Enthusiast",
  website: "https://azrl-webdev.vercel.app/",
  email: "azrlwebdev@gmail.com",
  expertise: ["React.js", "Three.js", "Laravel", "Node.js", "PostgreSQL"],
  currentRole: "Front-End Developer Intern at Starspace Studio",
  projects: "25+ completed projects",
  specialization: "3D Interactive Web Experiences",
};

// Cache untuk website data
let websiteCache = {
  data: null,
  lastUpdated: null,
  isValid() {
    if (!this.data || !this.lastUpdated) return false;
    return Date.now() - this.lastUpdated < 300000; // 5 minutes
  },
};

// Function untuk scrape website data
async function getWebsiteData() {
  try {
    if (websiteCache.isValid()) {
      return websiteCache.data;
    }

    console.log("🔍 Fetching website data...");

    const response = await axios.get(quickKnowledgeBase.website, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AzrielBot/1.0)",
      },
    });

    const $ = cheerio.load(response.data);

    const scrapedData = {
      title: $("title").text() || "Azriel Rosadi Portfolio",
      description: $('meta[name="description"]').attr("content") || "",
      technologies: [],
      projects: [],
      headings: [],
      lastScraped: new Date().toISOString(),
    };

    // Extract headings untuk context
    $("h1, h2, h3").each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 100) {
        scrapedData.headings.push(text);
      }
    });

    // Extract tech keywords
    const techKeywords = [
      "React",
      "Next.js",
      "Three.js",
      "JavaScript",
      "TypeScript",
      "Laravel",
      "Node.js",
      "PostgreSQL",
      "Tailwind",
      "GSAP",
    ];
    const pageText = $("body").text().toLowerCase();

    techKeywords.forEach((tech) => {
      if (pageText.includes(tech.toLowerCase())) {
        scrapedData.technologies.push(tech);
      }
    });

    // Cache hasil
    websiteCache.data = scrapedData;
    websiteCache.lastUpdated = Date.now();

    console.log(
      "✅ Website data cached:",
      scrapedData.technologies.length,
      "technologies found"
    );
    return scrapedData;
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    return {
      title: "Azriel Rosadi Portfolio",
      technologies: ["React", "Three.js", "JavaScript", "Laravel"],
      headings: ["Web Developer & 3D Enthusiast"],
      error: error.message,
      lastScraped: new Date().toISOString(),
    };
  }
}

// Enhanced context generator
function generateContext(message, websiteData) {
  const msg = message.toLowerCase();
  let context = "";

  if (
    msg.includes("proyek") ||
    msg.includes("project") ||
    msg.includes("portfolio")
  ) {
    context = `
    🚀 PROJECTS & PORTFOLIO:
    - Spesialisasi: Interactive 3D web experiences dengan Three.js
    - Total completed: 25+ projects dengan 95% client satisfaction
    - Technologies from website: ${websiteData.technologies.join(", ")}
    - Key projects: Liboyy Store (gaming platform), Mbuutt Laundry (management system)
    `;
  }

  if (
    msg.includes("teknologi") ||
    msg.includes("skill") ||
    msg.includes("tech")
  ) {
    context = `
    💻 TECHNICAL SKILLS:
    - Frontend: React, Next.js, Three.js, TypeScript
    - Backend: Node.js, Laravel, PHP
    - Database: PostgreSQL, MySQL
    - Specialization: 3D web development dengan WebGL
    - Live tech stack: ${websiteData.technologies.join(", ")}
    `;
  }

  if (
    msg.includes("kontak") ||
    msg.includes("contact") ||
    msg.includes("hire")
  ) {
    context = `
    📞 CONTACT INFO:
    - Email: azrlwebdev@gmail.com
    - Website: https://azrl-webdev.vercel.app/
    - Available for: Freelance projects, collaborations
    - Response time: Usually within 24 hours
    `;
  }

  return context;
}

// Main chat endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get website data
    const websiteData = await getWebsiteData();
    const contextInfo = generateContext(message, websiteData);

    // Enhanced system prompt
    const systemPrompt = `Anda adalah AI assistant profesional untuk portfolio Azriel Rosadi, Web Developer & 3D Enthusiast yang berbakat.

INFORMASI AZRIEL:
- Name: ${quickKnowledgeBase.name}
- Role: ${quickKnowledgeBase.currentRole}
- Website: ${quickKnowledgeBase.website}
- Email: ${quickKnowledgeBase.email}
- Expertise: ${quickKnowledgeBase.expertise.join(", ")}
- Projects: ${quickKnowledgeBase.projects}
- Specialization: ${quickKnowledgeBase.specialization}

REAL-TIME WEBSITE DATA:
- Title: ${websiteData.title}
- Technologies found: ${websiteData.technologies.join(", ")}
- Headings: ${websiteData.headings.slice(0, 3).join(" | ")}

${contextInfo}

INSTRUCTIONS:
1. Jawab dalam bahasa Indonesia yang ramah dan profesional
2. Highlight keahlian Azriel dalam 3D web development dan modern technologies
3. Berikan informasi specific tentang pengalaman dan projects
4. Jika ditanya contact, arahkan ke email atau website form
5. Untuk pertanyaan di luar portfolio, redirect dengan sopan
6. Gunakan emoji secukupnya untuk engaging conversation
7. Tunjukkan enthusiasm tentang teknologi web development

Persona: Professional, tech-savvy, passionate, helpful.`;

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
                  text: `${systemPrompt}\n\nUser: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
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
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    let aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";

    // Add website reference jika teknologi ditemukan
    if (
      websiteData.technologies.length > 0 &&
      !aiResponse.includes("website")
    ) {
      aiResponse += `\n\n🌐 *Info dari website: Menggunakan ${websiteData.technologies
        .slice(0, 3)
        .join(", ")} dan teknologi modern lainnya.*`;
    }

    res.json({
      response: aiResponse,
      metadata: {
        websiteLastScraped: websiteData.lastScraped,
        technologiesFound: websiteData.technologies.length,
      },
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);

    // Smart fallback berdasarkan konteks
    const message = req.body.message?.toLowerCase() || "";
    let fallbackResponse =
      "Maaf, terjadi kesalahan pada server. Silakan coba lagi nanti.";

    if (message.includes("proyek") || message.includes("project")) {
      fallbackResponse = `🚀 Azriel memiliki portfolio yang amazing dengan 25+ completed projects! 

Spesialisasi utama:
- Interactive 3D web experiences dengan Three.js
- Modern web applications dengan React/Next.js
- E-commerce platforms dengan secure payment
- Fullstack development dengan Laravel & Node.js

Silakan explore websitenya untuk detail lengkap: https://azrl-webdev.vercel.app/`;
    } else if (message.includes("kontak") || message.includes("contact")) {
      fallbackResponse = `📞 Hubungi Azriel untuk collaboration:

✉️ Email: azrlwebdev@gmail.com  
🌐 Website: https://azrl-webdev.vercel.app/
📱 Response time: Biasanya dalam 24 jam

Available untuk freelance projects dan long-term partnerships!`;
    } else if (message.includes("teknologi") || message.includes("skill")) {
      fallbackResponse = `💻 Tech Stack Azriel:

🎨 Frontend: React.js, Next.js, Three.js, TypeScript
⚙️ Backend: Node.js, Laravel, PHP  
🗄️ Database: PostgreSQL, MySQL
🎭 Animation: GSAP, Framer Motion
🎮 3D Graphics: Three.js, WebGL

Spesialisasi unik: Interactive 3D web experiences yang memukau!`;
    }

    res.status(500).json({
      error: "Internal server error",
      response: fallbackResponse,
    });
  }
});

export default router;
