import axios from "axios";
import * as cheerio from "cheerio";
import { azrielKnowledgeBase } from "./knowledge-base.js";

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

// Website scraper function
export async function scrapeWebsiteData() {
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

// Context generator
export function generateContext(userMessage, websiteData) {
  const message = userMessage.toLowerCase();
  let contextualInfo = "";

  if (
    message.includes("proyek") ||
    message.includes("project") ||
    message.includes("portfolio")
  ) {
    contextualInfo = `
SPESIALISASI UTAMA AZRIEL:
- Interactive 3D web experiences dengan Three.js dan WebGL
- Modern responsive web applications dengan React.js/Next.js
- Fullstack development dengan Laravel dan Node.js
- E-commerce platforms dengan secure payment integration

STATISTIK PROFESIONAL:
- Total Projects: 25+ completed
- Client Satisfaction: 95%
- Technologies: ${websiteData.technologies.join(", ")}
- Specialization: 3D Interactive Web Development
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
- React.js, Next.js, TypeScript, JavaScript ES6+
- Three.js untuk 3D web experiences
- GSAP & Framer Motion untuk animations
- Tailwind CSS, SCSS untuk styling

BACKEND & DATABASE:
- Node.js dengan Express.js untuk APIs
- Laravel dengan PHP untuk web applications
- PostgreSQL & MySQL untuk data management

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
- Custom Web Development (mulai dari $300)
- 3D Interactive Experiences ($1200-2000)
- E-commerce Solutions ($800-1500)
- Fullstack Applications ($1000-2500)

Status: Available untuk new projects
    `;
  }

  return contextualInfo;
}
