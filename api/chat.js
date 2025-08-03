// /api/chat.js - Vercel Serverless Function
import axios from "axios";
import * as cheerio from "cheerio";

// Cache untuk menyimpan data portfolio yang di-scrape
let portfolioCache = null;
let lastScrapeTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 menit

// Function untuk scrape website portfolio
async function scrapePortfolioWebsite() {
  try {
    console.log("🔍 Scraping portfolio website...");
    const response = await axios.get("https://azrl-webdev.vercel.app", {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Portfolio-Bot/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const $ = cheerio.load(response.data);

    // Extract informasi dari berbagai section
    const portfolioData = {
      // Basic Info
      name:
        $('h1, .hero-title, [class*="name"]').first().text()?.trim() ||
        "Azriel Rosadi",
      title:
        $('h2, .hero-subtitle, [class*="title"]').first().text()?.trim() ||
        "Fullstack Developer",

      // About/Bio
      bio: $('p, .bio, .about, [class*="description"]')
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((text) => text.length > 50)
        .slice(0, 3),

      // Skills
      skills: $('[class*="skill"], [class*="tech"], .technology, .stack')
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((skill) => skill.length > 0 && skill.length < 50),

      // Projects
      projects: $('[class*="project"], .work-item, .portfolio-item')
        .map((i, el) => {
          const $project = $(el);
          return {
            title: $project
              .find('h3, h4, .title, [class*="title"]')
              .first()
              .text()
              ?.trim(),
            description: $project
              .find('p, .description, [class*="desc"]')
              .first()
              .text()
              ?.trim(),
            technologies: $project
              .find('[class*="tech"], .tech-stack, .stack')
              .map((j, tech) => $(tech).text().trim())
              .get(),
          };
        })
        .get()
        .filter((project) => project.title),

      // Experience
      experience: $('[class*="experience"], [class*="work"], .job')
        .map((i, el) => {
          const $exp = $(el);
          return {
            company: $exp
              .find('[class*="company"], .company, h4')
              .first()
              .text()
              ?.trim(),
            position: $exp
              .find('[class*="position"], .title, h5')
              .first()
              .text()
              ?.trim(),
            period: $exp
              .find('[class*="date"], .date, .period')
              .first()
              .text()
              ?.trim(),
            description: $exp
              .find('p, .description, [class*="desc"]')
              .first()
              .text()
              ?.trim(),
          };
        })
        .get()
        .filter((exp) => exp.company || exp.position),

      // Contact Info
      email:
        $('a[href^="mailto:"]').attr("href")?.replace("mailto:", "") ||
        "azrlwebdev@gmail.com",
      github:
        $('a[href*="github.com"]').attr("href") ||
        "https://github.com/AzrielRosadi",
      linkedin: $('a[href*="linkedin.com"]').attr("href") || "",
      instagram: $('a[href*="instagram.com"]').attr("href") || "",

      // Extract text content untuk context
      allText: $("body").text().replace(/\s+/g, " ").trim(),

      // Meta info
      lastUpdated: new Date().toISOString(),
      url: "https://azrl-webdev.vercel.app",
    };

    console.log("✅ Portfolio data scraped successfully");
    return portfolioData;
  } catch (error) {
    console.error("❌ Error scraping portfolio:", error.message);
    // Return fallback data jika scraping gagal
    return {
      name: "Azriel Rosadi",
      title: "Fullstack Developer",
      bio: [
        "Saya adalah seorang Fullstack Developer dengan pengalaman dalam mengembangkan aplikasi web modern.",
      ],
      email: "azrlwebdev@gmail.com",
      github: "https://github.com/AzrielRosadi",
      url: "https://azrl-webdev.vercel.app",
      error:
        "Data portfolio tidak dapat diakses saat ini, menggunakan informasi dasar.",
    };
  }
}

// Function untuk mendapatkan data portfolio (dengan caching)
async function getPortfolioData() {
  const now = Date.now();

  if (!portfolioCache || now - lastScrapeTime > CACHE_DURATION) {
    portfolioCache = await scrapePortfolioWebsite();
    lastScrapeTime = now;
  }

  return portfolioCache;
}

// Function untuk generate response menggunakan Gemini 2.0 Flash
async function generateGeminiResponse(userMessage, portfolioData) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY tidak ditemukan di environment variables"
      );
    }

    // Create context dari portfolio data
    const portfolioContext = `
INFORMASI PORTFOLIO AZRIEL ROSADI:
Nama: ${portfolioData.name || "Azriel Rosadi"}
Posisi: ${portfolioData.title || "Fullstack Developer"}

Bio: ${portfolioData.bio?.join(" ") || "Fullstack Developer berpengalaman"}

Skills: ${
      portfolioData.skills?.join(", ") ||
      "React, Node.js, Laravel, Python, JavaScript, TypeScript"
    }

Proyek Terbaru:
${
  portfolioData.projects
    ?.map((p) => `- ${p.title}: ${p.description}`)
    .join("\n") ||
  "- Platform top-up game dan layanan sosial media\n- System Laundry berbasis Website\n- DOML AI Marketing Platform"
}

Pengalaman:
${
  portfolioData.experience
    ?.map((e) => `- ${e.position} di ${e.company} (${e.period})`)
    .join("\n") ||
  "- Frontend Developer & Data Entry di PT. Spektrum Kreasi Pratama\n- Fullstack Laravel Developer di Mbuutt Laundry\n- Front-End Developer Intern di Starspace Studio"
}

Kontak:
Email: ${portfolioData.email || "azrlwebdev@gmail.com"}
GitHub: ${portfolioData.github || "https://github.com/AzrielRosadi"}
Portfolio: ${portfolioData.url || "https://azrl-webdev.vercel.app"}

Website Portfolio: https://azrl-webdev.vercel.app
`;

    const systemPrompt = `Anda adalah AI Assistant untuk portfolio Azriel Rosadi, seorang Fullstack Developer. 

TUGAS UTAMA:
1. Jawab pertanyaan tentang portfolio, proyek, pengalaman, dan layanan Azriel
2. Gunakan data real-time dari website portfolio yang telah di-scrape
3. Berikan informasi yang akurat dan helpful tentang Azriel
4. Jika ditanya di luar portfolio, tetap jawab dengan ramah namun arahkan kembali ke topik portfolio

GAYA KOMUNIKASI:
- Gunakan bahasa Indonesia yang natural dan ramah namun kalau User menanyakan dalam bahasa Inggris, balas dalam bahasa Inggris
- Sertakan emoji yang relevan untuk membuat percakapan lebih menarik
- Berikan informasi yang spesifik dan actionable
- Selalu sertakan kontak atau link portfolio jika relevan

DATA PORTFOLIO TERKINI:
${portfolioContext}

PANDUAN RESPONS:
- Untuk pertanyaan tentang proyek: Jelaskan detail teknis, tech stack, dan hasil
- Untuk pertanyaan tentang pengalaman: Fokus pada achievement dan kontribusi
- Untuk pertanyaan kontak/kolaborasi: Berikan informasi kontak yang jelas
- Untuk pertanyaan umum: Jawab singkat lalu kaitkan dengan expertise Azriel
- Untuk pertanyaan pricing/layanan: Arahkan untuk diskusi detail via email

Selalu prioritaskan informasi dari data portfolio yang fresh dan akurat.`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPertanyaan User: ${userMessage}\n\nBerikan respons yang informatif dan engaging:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
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
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        timeout: 15000,
      }
    );

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("Response tidak valid dari Gemini API");
    }

    return aiResponse.trim();
  } catch (error) {
    console.error("❌ Error generating Gemini response:", error.message);

    // Fallback response berdasarkan kata kunci
    const message = userMessage.toLowerCase();

    if (message.includes("proyek") || message.includes("project")) {
      return `🚀 **Portfolio Azriel - 25+ Projects Completed!**

Beberapa proyek unggulan:
• **Platform Top-up Game & Social Media** - React, TypeScript, Node.js, PostgreSQL
• **System Laundry Website** - Laravel 11, MySQL, TailwindCSS  
• **DOML AI Marketing Platform** - React, AI Integration
• **Mechstrom: War Zone Game** - Unity, C#

💻 Tech Stack: React, Laravel, Node.js, Python, Unity
📧 Diskusi proyek: **azrlwebdev@gmail.com**
🌐 Portfolio lengkap: https://azrl-webdev.vercel.app`;
    }

    if (message.includes("kontak") || message.includes("contact")) {
      return `📞 **Kontak Azriel Rosadi:**

✉️ Email: **azrlwebdev@gmail.com**
🌐 Portfolio: https://azrl-webdev.vercel.app
💼 GitHub: https://github.com/AzrielRosadi
🔗 LinkedIn: https://linkedin.com/in/azriel-rosadi

⚡ **Response Time:** < 24 jam
💬 **Available for:** Freelance projects, collaboration, consultation`;
    }

    if (message.includes("pengalaman") || message.includes("experience")) {
      return `💼 **Pengalaman Kerja Azriel:**

🏢 **Frontend Developer & Data Entry** - PT. Spektrum Kreasi Pratama (Nov 2023 - Feb 2024)
🏢 **Fullstack Laravel Developer** - Mbuutt Laundry (Jan - Feb 2025)  
🏢 **Fullstack JavaScript Developer** - Liboyy Store (Mar - May 2025)
🏢 **Frontend Developer Intern** - Starspace Studio (Jun 2025 - Present)

📈 **Achievement:** 25+ completed projects, 90% client retention rate
💻 **Expertise:** Fullstack Development, UI/UX Implementation, System Integration`;
    }

    return `😅 **Maaf, terjadi gangguan teknis!**

Saya AI Assistant untuk portfolio Azriel Rosadi. Silakan coba bertanya tentang:

🚀 **Proyek & Portfolio** (25+ completed)
💻 **Tech Stack & Skills** 
💼 **Pengalaman Kerja**
📞 **Kontak & Kolaborasi**

📧 **Email langsung:** azrlwebdev@gmail.com
🌐 **Portfolio:** https://azrl-webdev.vercel.app

Ada yang ingin Anda ketahui? 🎯`;
  }
}

// Main API handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST requests are supported",
    });
  }

  try {
    const { message } = req.body;

    // Validasi input
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Message is required and must be a non-empty string",
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: "Message too long",
        message: "Message must be less than 1000 characters",
      });
    }

    console.log("📨 Incoming message:", message.substring(0, 100) + "...");

    // Get portfolio data
    const portfolioData = await getPortfolioData();

    // Generate AI response
    const aiResponse = await generateGeminiResponse(message, portfolioData);

    console.log("✅ Response generated successfully");

    return res.status(200).json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: "gemini-2.0-flash",
      portfolioLastUpdated: portfolioData.lastUpdated,
    });
  } catch (error) {
    console.error("❌ API Error:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: "Terjadi kesalahan pada server. Silakan coba lagi.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
