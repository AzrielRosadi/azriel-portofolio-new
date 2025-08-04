// /api/chat.js - Enhanced Version with Smart Portfolio Integration
import axios from "axios";
import * as cheerio from "cheerio";

// Cache untuk menyimpan data portfolio yang di-scrape
let portfolioCache = null;
let lastScrapeTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 menit

// Static data portfolio yang sudah diketahui
const staticPortfolioData = {
  name: "Azriel Rosadi",
  title: "Fullstack Developer",
  bio: [
    "Saya adalah seorang Fullstack Developer dengan pengalaman dalam mengembangkan aplikasi web modern menggunakan berbagai teknologi.",
    "Berpengalaman dalam membangun platform web end-to-end dengan fokus pada user experience dan performance optimization.",
    "Memiliki track record yang baik dalam menyelesaikan 25+ proyek dengan tingkat kepuasan client 90%.",
  ],
  skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express.js",
    "Laravel",
    "PHP",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "TailwindCSS",
    "CSS3",
    "HTML5",
    "Unity",
    "C#",
    "Python",
    "Git",
    "Vercel",
    "Next.js",
    "Drizzle ORM",
    "React Query",
    "Framer Motion",
    "Vite",
    "PostCSS",
  ],
  projects: [
    {
      id: 1,
      title: "Platform top-up game dan layanan sosial media",
      description:
        "Platform web untuk layanan top-up game dan sosial media dengan sistem pembayaran terintegrasi",
      technologies: [
        "React",
        "TypeScript",
        "TailwindCSS",
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "Drizzle ORM",
        "React Query",
      ],
      year: 2025,
      category: "web",
    },
    // ... other projects
  ],
  experience: [
    {
      company: "Starspace Studio",
      position: "Front-End Developer Intern",
      period: "June 2025 - Present",
      description:
        "Program internship intensif dengan fokus pengembangan teknis dan budaya kerja kolaboratif",
    },
    // ... other experiences
  ],
  contact: {
    email: "azrlwebdev@gmail.com",
    github: "https://github.com/AzrielRosadi",
    linkedin: "https://www.linkedin.com/in/azriel-rosadi-aa2859343/",
    portfolio: "https://azrl-webdev.vercel.app",
  },
};

// Enhanced function untuk mengecek kategori pertanyaan
function categorizeQuestion(message) {
  const messageLower = message.toLowerCase();

  // Portfolio-related keywords
  const portfolioKeywords = [
    "proyek",
    "project",
    "portfolio",
    "azriel",
    "rosadi",
    "webdev",
    "pengalaman",
    "experience",
    "skill",
    "teknologi",
    "kontak",
    "contact",
    "fullstack",
    "developer",
    "hire",
    "freelance",
    "harga",
    "price",
  ];

  // Tech-related keywords (relevan dengan portfolio tech)
  const techKeywords = [
    "javascript",
    "react",
    "laravel",
    "node",
    "database",
    "mysql",
    "programming",
    "coding",
    "web",
    "website",
    "aplikasi",
    "system",
    "framework",
    "library",
    "api",
    "frontend",
    "backend",
    "fullstack",
  ];

  // Business/Career keywords (relevan dengan services)
  const businessKeywords = [
    "bisnis",
    "business",
    "startup",
    "company",
    "client",
    "customer",
    "project management",
    "team",
    "collaboration",
    "remote work",
    "freelance",
    "consultant",
    "service",
    "solution",
  ];

  // General tech topics (masih relevan tapi tidak langsung)
  const generalTechKeywords = [
    "artificial intelligence",
    "ai",
    "machine learning",
    "blockchain",
    "cloud",
    "aws",
    "docker",
    "kubernetes",
    "microservices",
    "devops",
  ];

  const isPortfolio = portfolioKeywords.some((keyword) =>
    messageLower.includes(keyword)
  );
  const isTechRelated = techKeywords.some((keyword) =>
    messageLower.includes(keyword)
  );
  const isBusinessRelated = businessKeywords.some((keyword) =>
    messageLower.includes(keyword)
  );
  const isGeneralTech = generalTechKeywords.some((keyword) =>
    messageLower.includes(keyword)
  );

  return {
    isPortfolio,
    isTechRelated,
    isBusinessRelated,
    isGeneralTech,
    category: isPortfolio
      ? "portfolio"
      : isTechRelated
      ? "tech"
      : isBusinessRelated
      ? "business"
      : isGeneralTech
      ? "general-tech"
      : "general",
  };
}

// Function untuk generate portfolio snippet berdasarkan kategori
function generateRelevantPortfolioSnippet(category, portfolioData) {
  switch (category) {
    case "tech":
      return `**💻 TECH EXPERTISE AZRIEL:**
• **Full-Stack Development:** React, Node.js, Laravel dengan 25+ completed projects
• **Database Solutions:** MySQL, PostgreSQL, MongoDB - proven in production
• **Modern Stack:** TypeScript, Next.js, Express.js dengan best practices
• **Game Development:** Unity Engine, C# untuk interactive applications

**📧 TECHNICAL CONSULTATION:**
Email: ${portfolioData.contact?.email || "azrlwebdev@gmail.com"}`;

    case "business":
      return `**💼 BUSINESS COLLABORATION:**
• **Azriel Rosadi** - Fresh Graduate Fullstack Developer
• **Track Record:** 90% client satisfaction, 100% project success rate
• **Services:** Web development, System solutions, Technical consultation
• **Approach:** Quality focus, reliable communication, on-time delivery

**📧 BUSINESS INQUIRY:**
Email: ${portfolioData.contact?.email || "azrlwebdev@gmail.com"}`;

    case "general-tech":
      return `**🚀 MODERN DEVELOPMENT APPROACH:**
• **Azriel Rosadi** applies cutting-edge technologies in real projects
• **Current Focus:** React ecosystem, Laravel framework, Game development
• **Innovation:** AI integration, modern UI/UX, scalable architectures
• **Always Learning:** Staying updated with latest tech trends

**📧 DISCUSS TECHNOLOGY:**
Email: ${portfolioData.contact?.email || "azrlwebdev@gmail.com"}`;

    default:
      return `**💡 CONNECT WITH AZRIEL ROSADI:**
• **Fresh Graduate Fullstack Developer** siap membantu proyek Anda
• **Specialization:** Web development, Full-stack solutions, Game development
• **Available for:** Freelance projects, Technical consultation, Collaboration

**📧 GET IN TOUCH:**
Email: ${portfolioData.contact?.email || "azrlwebdev@gmail.com"} | Portfolio: ${
        portfolioData.contact?.portfolio || "https://azrl-webdev.vercel.app"
      }`;
  }
}

// Enhanced function untuk generate response menggunakan Gemini 2.0 Flash
async function generateGeminiResponse(userMessage, portfolioData) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY tidak ditemukan di environment variables"
      );
    }

    // Categorize the question
    const questionCategory = categorizeQuestion(userMessage);

    // Create portfolio context
    const portfolioContext = `
PORTFOLIO AZRIEL ROSADI - FRESH GRADUATE FULLSTACK DEVELOPER:
============================================================

BASIC INFO:
- Nama: ${portfolioData.name}
- Posisi: ${portfolioData.title}
- Status: Fresh Graduate dengan 1+ years experience
- Email: ${portfolioData.contact?.email}
- Portfolio: ${portfolioData.contact?.portfolio}

SKILLS: ${portfolioData.skills?.join(", ")}

RECENT PROJECTS:
${portfolioData.projects
  ?.slice(0, 4)
  .map(
    (p) => `- ${p.title} (${p.year}): ${p.technologies?.slice(0, 3).join(", ")}`
  )
  .join("\n")}

EXPERIENCE:
${portfolioData.experience
  ?.slice(0, 2)
  .map((e) => `- ${e.position} at ${e.company} (${e.period})`)
  .join("\n")}

ACHIEVEMENTS: 25+ projects, 90% client satisfaction, 100% success rate
`;

    let systemPrompt;

    if (questionCategory.isPortfolio) {
      // Full portfolio-focused response
      systemPrompt = `Anda adalah AI Assistant khusus untuk portfolio Azriel Rosadi. Fokus pada informasi portfolio, proyek, pengalaman, dan layanan.

TUGAS: Berikan informasi detail tentang portfolio Azriel dengan formatting terstruktur menggunakan emoji dan bold text.

PORTFOLIO DATA: ${portfolioContext}

FORMAT WAJIB:
🎯 **[TOPIC UTAMA]**
**[Sub-topic dengan emoji]:**
• **Label Bold:** Penjelasan detail
• **Label Bold:** Penjelasan detail

ATURAN:
- Bahasa Indonesia natural
- Emoji untuk setiap major section  
- Bold text untuk labels penting
- Maksimal 1 URL per response
- Informasi spesifik dan actionable`;
    } else {
      // General question with portfolio integration
      systemPrompt = `Anda adalah AI Assistant yang menjawab pertanyaan umum, namun WAJIB mengakhiri dengan portfolio spotlight Azriel Rosadi.

TUGAS UTAMA:
1. Jawab pertanyaan user dengan informatif dan helpful
2. WAJIB akhiri dengan section portfolio yang relevan dengan topik
3. Gunakan formatting terstruktur dengan emoji dan bold text

PORTFOLIO INFO: ${portfolioContext}

FORMAT RESPONSE:
🤖 **[JAWABAN PERTANYAAN UMUM]**

**[Sub-topic dengan emoji]:**
• **Point 1:** Penjelasan lengkap
• **Point 2:** Penjelasan lengkap

**💼 PORTFOLIO CONNECTION:**
[Portfolio snippet yang relevan dengan topik yang dibahas]

ATURAN:
- Jawab pertanyaan dengan quality content
- Kaitkan portfolio jika ada relevansi teknis/bisnis
- WAJIB section portfolio di akhir
- Format rapi dengan emoji dan bold
- Bahasa Indonesia (kecuali user tanya bahasa lain)
- Maksimal 1-2 URL

KATEGORI PERTANYAAN: ${questionCategory.category}
RELEVANSI PORTFOLIO: ${
        questionCategory.isTechRelated
          ? "TINGGI"
          : questionCategory.isBusinessRelated
          ? "SEDANG"
          : "RENDAH"
      }`;
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPertanyaan User: ${userMessage}\n\nBerikan respons yang informatif dengan formatting TERSTRUKTUR dan RAPI${
                  !questionCategory.isPortfolio
                    ? " (WAJIB akhiri dengan portfolio section yang relevan)"
                    : ""
                }:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1400,
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

    // Enhanced fallback with category-aware responses
    const questionCategory = categorizeQuestion(userMessage);
    const portfolioSnippet = generateRelevantPortfolioSnippet(
      questionCategory.category,
      portfolioData
    );

    if (questionCategory.isPortfolio) {
      // Portfolio fallback
      return `🚀 **Portfolio Azriel Rosadi - Fresh Graduate Fullstack Developer**

**👨‍💻 PROFIL SINGKAT:**
• **Nama:** Azriel Rosadi
• **Status:** Fresh Graduate dengan pengalaman praktis
• **Specialization:** Web Development, Game Development, Full-stack Solutions

**💻 HIGHLIGHTS:**
• **Projects:** 25+ completed with 90% client satisfaction
• **Tech Stack:** React, Laravel, Node.js, Unity, TypeScript
• **Current Role:** Frontend Developer Intern at Starspace Studio

**📧 KONTAK:**
Email: ${portfolioData.contact?.email || "azrlwebdev@gmail.com"}`;
    }

    // General question fallback with relevant portfolio
    return `🤖 **Maaf, sistem sedang maintenance**

**💬 JAWABAN SINGKAT:**
• Server sedang dalam perbaikan sementara
• Silakan coba lagi dalam beberapa menit
• Atau hubungi langsung untuk diskusi lebih lanjut

${portfolioSnippet}`;
  }
}

// Main API handler (tetap sama seperti sebelumnya)
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

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

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
    const portfolioData = portfolioCache || staticPortfolioData;

    // Categorize question for response metadata
    const questionCategory = categorizeQuestion(message);

    // Generate AI response
    const aiResponse = await generateGeminiResponse(message, portfolioData);

    console.log("✅ Response generated successfully");

    return res.status(200).json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: "gemini-2.0-flash-enhanced",
      questionCategory: questionCategory.category,
      portfolioRelevance: questionCategory.isPortfolio
        ? "direct"
        : questionCategory.isTechRelated
        ? "high"
        : questionCategory.isBusinessRelated
        ? "medium"
        : "low",
      smartIntegration: true,
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
