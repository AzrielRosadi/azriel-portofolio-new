// /api/chat.js - Vercel Serverless Function (ENHANCED VERSION - PORTFOLIO FOCUSED)
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
    {
      id: 2,
      title: "System Laundry berbasis Website",
      description:
        "Sistem manajemen laundry lengkap dengan fitur admin, owner, dan customer dashboard",
      technologies: [
        "Laravel 11",
        "MySQL",
        "TailwindCSS",
        "Blade Template",
        "Laravel Breeze",
        "Laravel Sanctum",
      ],
      year: 2025,
      category: "web",
    },
    {
      id: 3,
      title: "DOML | AI Marketing Optimized Reach",
      description:
        "Landing page prototype untuk platform marketing berbasis AI dengan design modern dan interactive",
      technologies: ["React", "TailwindCSS", "Lucide React", "PostCSS"],
      year: 2025,
      category: "web",
    },
    {
      id: 4,
      title: "Imaginify | AI SaaS Platform",
      description:
        "Platform SaaS dengan fitur AI dan sistem pembayaran credits (dalam pengembangan)",
      technologies: ["Next.js", "MongoDB", "Stripe", "Cloudinary", "Clerk"],
      year: 2025,
      category: "ai",
    },
    {
      id: 5,
      title: "Citra Negara Website",
      description: "Website sekolah dengan backend Go dan frontend modern",
      technologies: ["Go", "JavaScript", "SASS", "CSS3", "HTML5"],
      year: 2024,
      category: "web",
    },
    {
      id: 6,
      title: "Mechstrom: War Zone",
      description:
        "Game 3D sederhana menggunakan Unity Engine dengan gameplay dasar dan asset gratis",
      technologies: ["Unity", "C#", "Blender"],
      year: 2024,
      category: "game",
    },
    {
      id: 7,
      title: "Tools Scraper - GUI Application",
      description:
        "Aplikasi desktop GUI untuk scraping data produk Shopee secara otomatis dan efisien",
      technologies: ["Python"],
      year: 2024,
      category: "desktop",
    },
    {
      id: 8,
      title: "Games Pacman - Classic Arcade",
      description:
        "Implementasi game Pacman klasik menggunakan JavaScript dan HTML5 Canvas",
      technologies: ["JavaScript", "HTML5"],
      year: 2023,
      category: "game",
    },
    {
      id: 9,
      title: "Games Tetris - Classic Puzzle",
      description:
        "Game Tetris klasik dengan implementasi JavaScript dan HTML5",
      technologies: ["JavaScript", "HTML5"],
      year: 2023,
      category: "game",
    },
    {
      id: 10,
      title: "Search Film - IMDb API",
      description:
        "Platform pencarian film dan serial TV comprehensive dengan database IMDb melalui API integration",
      technologies: ["JavaScript", "HTML5", "CSS3"],
      year: 2023,
      category: "web",
    },
  ],

  experience: [
    {
      company: "Starspace Studio",
      position: "Front-End Developer Intern",
      period: "June 2025 - Present",
      date: "June 2025 - Present",
      description:
        "Program internship intensif dengan fokus pengembangan teknis dan budaya kerja kolaboratif",
      responsibilities: [
        "Mengembangkan antarmuka web interaktif dan responsif berdasarkan desain Figma",
        "Terlibat dalam proyek nyata sebagai bagian dari Mission Possible, bekerja kolaboratif dalam tim lintas bidang",
        "Update progres harian menggunakan ClickUp dan aktif dalam weekly meeting & coffee roulette",
        "Berpartisipasi dalam sesi mentoring dan reverse mentorship untuk berbagi insight",
      ],
    },
    {
      company: "Liboyy Store",
      position: "Fullstack JavaScript Developer",
      period: "March 2025 - May 2025",
      date: "March 2025 - May 2025",
      description:
        "Membangun platform web dengan stack React, Node.js, dan PostgreSQL",
      responsibilities: [
        "Membangun aplikasi web responsif menggunakan React dan mengintegrasikannya dengan backend Node.js",
        "Meningkatkan performa aplikasi dan pengalaman pengguna melalui optimasi kode",
        "Mengimplementasikan fitur-fitur berdasarkan masukan client untuk memenuhi kebutuhan pengguna",
      ],
    },
    {
      company: "Mbuutt Laundry",
      position: "Full Stack Laravel Developer",
      period: "Jan 2025 - Feb 2025",
      date: "Jan 2025 - Feb 2025",
      description:
        "Membangun sistem Mbuutt Laundry secara penuh sebagai Fullstack Developer",
      responsibilities: [
        "Memimpin pengembangan platform web Mbuutt Laundry sebagai Fullstack Developer",
        "Secara mandiri membangun seluruh fitur frontend dan backend",
        "Berkontribusi pada pengembangan alat internal dan komponen yang dapat digunakan kembali",
      ],
    },
    {
      company: "PT. Spektrum Kreasi Pratama",
      position: "Frontend Developer & Microsoft Excel data entry",
      period: "November 2023 - Februari 2024",
      date: "November 2023 - Februari 2024",
      description:
        "Mengembangkan frontend dan mengelola data entry untuk sistem inventory laboratorium",
      responsibilities: [
        "Mengembangkan dan memelihara fitur-fitur frontend untuk situs web inventory alat laboratorium",
        "Mengoptimalkan aplikasi web untuk kecepatan dan skalabilitas maksimum",
        "Mengubah sertifikat fisik menjadi file PDF dan menginputkannya ke Microsoft Excel",
      ],
    },
  ],

  testimonials: [
    {
      name: "Liboyy Store",
      mentions: "@liboyystore_26",
      review:
        "Saya sangat puas bekerja sama dengan Azriel WebDev, seorang fullstack developer yang memiliki kemampuan teknis luar biasa. Ia berhasil membangun website top up games yang responsif, cepat, dan user-friendly, sekaligus mengintegrasikan layanan sosial media dengan sangat baik!",
    },
    {
      name: "Mbuutt Company",
      mentions: "@mbuuttcorp",
      review:
        "Bekerja sama dalam pengembangan website sistem laundry ini merupakan pengalaman yang sangat profesional. Komitmen terhadap ketepatan waktu, kualitas hasil, serta perhatian terhadap setiap detail proyek sangat terlihat jelas.",
    },
    {
      name: "PT. Spektrum Kreasi Pratama",
      mentions: "@spektrumkp",
      review:
        "Azriel membawa kreativitas dan keahlian ke dalam tim, sehingga meningkatkan kinerja frontend dan entry data kami secara signifikan. Dedikasinya terhadap detail dan kolaborasi yang efektif membuat proyek berjalan lancar dan hasilnya sangat memuaskan.",
    },
  ],

  abilities: [
    {
      title: "Quality Focus",
      description:
        "Memberikan hasil berkualitas tinggi dengan tetap memperhatikan setiap detail",
    },
    {
      title: "Reliable Communication",
      description:
        "Menjaga Anda tetap mendapat informasi terkini pada setiap langkah untuk memastikan transparansi dan kejelasan",
    },
    {
      title: "On-Time Delivery",
      description:
        "Memastikan proyek selesai sesuai jadwal, dengan kualitas & perhatian terhadap detail",
    },
  ],

  counterItems: [
    { value: 0, suffix: "+", label: "FreshGraduate" },
    { value: 3, suffix: "+", label: "Client" },
    { value: 25, suffix: "+", label: "Completed Projects" },
    { value: 90, suffix: "%", label: "Client Retention Rate" },
  ],

  contact: {
    email: "azrlwebdev@gmail.com",
    github: "https://github.com/AzrielRosadi",
    linkedin: "https://www.linkedin.com/in/azriel-rosadi-aa2859343/",
    instagram: "https://www.instagram.com/azrlrsdi_/",
    portfolio: "https://azrl-webdev.vercel.app",
  },
};

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

    // Merge scraped data dengan static data
    const scrapedData = {
      ...staticPortfolioData,

      // Override dengan data yang di-scrape jika ada
      name:
        $('h1, .hero-title, [class*="name"]').first().text()?.trim() ||
        staticPortfolioData.name,
      title:
        $('h2, .hero-subtitle, [class*="title"]').first().text()?.trim() ||
        staticPortfolioData.title,

      // Extract additional bio jika ada
      scrapedBio: $('p, .bio, .about, [class*="description"]')
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((text) => text.length > 50)
        .slice(0, 2),

      // Extract additional skills jika ada
      scrapedSkills: $('[class*="skill"], [class*="tech"], .technology, .stack')
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((skill) => skill.length > 0 && skill.length < 50),

      // Meta info
      lastUpdated: new Date().toISOString(),
      url: "https://azrl-webdev.vercel.app",
      dataSource: "scraped",
    };

    console.log("✅ Portfolio data scraped successfully");
    return scrapedData;
  } catch (error) {
    console.error("❌ Error scraping portfolio:", error.message);
    // Return static data jika scraping gagal
    return {
      ...staticPortfolioData,
      lastUpdated: new Date().toISOString(),
      url: "https://azrl-webdev.vercel.app",
      dataSource: "static",
      error:
        "Data portfolio menggunakan informasi static karena scraping gagal.",
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

// Function untuk mengecek apakah pertanyaan terkait portfolio
function isPortfolioRelated(message) {
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
    "tech",
    "stack",
    "kontak",
    "contact",
    "email",
    "github",
    "linkedin",
    "instagram",
    "fullstack",
    "developer",
    "javascript",
    "react",
    "laravel",
    "node",
    "unity",
    "game",
    "website",
    "aplikasi",
    "system",
    "platform",
    "frontend",
    "backend",
    "database",
    "mysql",
    "postgresql",
    "mongodb",
    "testimoni",
    "testimonial",
    "client",
    "laundry",
    "liboyy",
    "starspace",
    "spektrum",
    "mbuutt",
    "hire",
    "freelance",
    "kolaborasi",
    "collaboration",
    "harga",
    "price",
    "biaya",
    "cost",
    "layanan",
    "service",
    "sosial",
    "social",
    "media",
    "follow",
    "hubungi",
    "reach",
    "account",
  ];

  const messageLower = message.toLowerCase();
  return portfolioKeywords.some((keyword) => messageLower.includes(keyword));
}

// Function untuk membersihkan response dari URL duplikat
function cleanDuplicateUrls(text) {
  // Regex untuk mendeteksi URL yang duplikat dalam format yang berbeda
  const urlPattern = /(https?:\/\/[^\s\[\]()]+)/g;
  const markdownLinkPattern = /\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g;

  let urls = new Set();
  let cleanedText = text;

  // Extract semua URL dari text
  const foundUrls = text.match(urlPattern) || [];
  const foundMarkdownLinks = [...text.matchAll(markdownLinkPattern)];

  // Jika ada URL duplikat, hapus yang berlebihan
  if (foundUrls.length > 1) {
    // Ambil URL pertama saja
    const firstUrl = foundUrls[0];

    // Hapus URL duplikat sisanya
    for (let i = 1; i < foundUrls.length; i++) {
      const duplicateUrl = foundUrls[i];
      // Hapus URL duplikat dari text
      cleanedText = cleanedText.replace(
        new RegExp(duplicateUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        ""
      );
    }

    // Bersihkan format yang rusak akibat penghapusan
    cleanedText = cleanedText
      .replace(/\(\s*\)/g, "") // Hapus () kosong
      .replace(/\[\s*\]/g, "") // Hapus [] kosong
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  }

  return cleanedText;
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

    // Check if question is portfolio-related
    const isPortfolioQuestion = isPortfolioRelated(userMessage);

    // Create context dari portfolio data
    const portfolioContext = `
INFORMASI PORTFOLIO AZRIEL ROSADI:
=================================

BASIC INFO:
- Nama: ${portfolioData.name}
- Posisi: ${portfolioData.title}
- Status: Fresh Graduate Fullstack Developer

BIO & DESKRIPSI:
${
  portfolioData.bio?.join("\n") ||
  "Fullstack Developer berpengalaman dengan track record yang baik"
}

SKILLS & TEKNOLOGI:
${
  portfolioData.skills?.join(", ") ||
  "React, Node.js, Laravel, Python, JavaScript, TypeScript"
}

PROYEK UNGGULAN (${portfolioData.projects?.length || 10}+ Projects):
${
  portfolioData.projects
    ?.map(
      (p, i) =>
        `${i + 1}. ${p.title} (${p.year})
   - Deskripsi: ${p.description}
   - Tech Stack: ${p.technologies?.join(", ")}
   - Kategori: ${p.category}`
    )
    .join("\n\n") ||
  "Platform top-up game, System Laundry, DOML AI Marketing, Games Unity"
}

PENGALAMAN KERJA:
${
  portfolioData.experience
    ?.map(
      (e, i) =>
        `${i + 1}. ${e.position} - ${e.company} (${e.period})
   - ${e.description}
   - Key Responsibilities: ${e.responsibilities?.slice(0, 2).join("; ")}`
    )
    .join("\n\n") ||
  "Frontend Developer, Fullstack Laravel Developer, Fullstack JavaScript Developer"
}

TESTIMONIAL CLIENT:
${
  portfolioData.testimonials
    ?.map((t, i) => `${i + 1}. ${t.name} (${t.mentions}): "${t.review}"`)
    .join("\n") || "Testimoni positif dari berbagai client"
}

ACHIEVEMENT:
- ${
      portfolioData.counterItems?.find(
        (item) => item.label === "Completed Projects"
      )?.value || 25
    }+ Completed Projects
- ${
      portfolioData.counterItems?.find(
        (item) => item.label === "Client Retention Rate"
      )?.value || 90
    }% Client Retention Rate
- ${
      portfolioData.counterItems?.find((item) => item.label === "Client")
        ?.value || 3
    }+ Happy Clients
- Fresh Graduate dengan pengalaman praktis

KONTAK & PORTFOLIO:
- Email: ${portfolioData.contact?.email || "azrlwebdev@gmail.com"}
- GitHub: ${portfolioData.contact?.github || "https://github.com/AzrielRosadi"}
- LinkedIn: ${
      portfolioData.contact?.linkedin ||
      "https://www.linkedin.com/in/azriel-rosadi-aa2859343/"
    }
- Instagram: ${
      portfolioData.contact?.instagram || "https://www.instagram.com/azrlrsdi_/"
    }
- Portfolio Website: ${
      portfolioData.contact?.portfolio || "https://azrl-webdev.vercel.app"
    }

KEUNGGULAN:
${
  portfolioData.abilities
    ?.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`)
    .join("\n") || "Quality Focus, Reliable Communication, On-Time Delivery"
}
`;

    const systemPrompt = isPortfolioQuestion
      ? `Anda adalah AI Assistant khusus untuk portfolio Azriel Rosadi, seorang Fresh Graduate Fullstack Developer. Fokus utama adalah membahas portfolio, proyek, pengalaman, dan layanan Azriel.

TUGAS UTAMA:
1. PRIORITASKAN informasi tentang portfolio Azriel Rosadi
2. Jawab pertanyaan tentang proyek, pengalaman, skills, kontak dengan detail lengkap
3. Gunakan data akurat dari portfolio yang telah disediakan
4. Berikan informasi yang spesifik dan helpful tentang Azriel

ATURAN FORMATTING WAJIB:
======================

**1. STRUKTUR RESPONSE YANG TERORGANISIR:**
- SELALU gunakan format yang konsisten dan terstruktur
- Mulai dengan header utama menggunakan emoji + **bold text**
- Pisahkan setiap section dengan line break yang jelas
- Gunakan bullet points (•) untuk list items
- Gunakan sub-bullets (-) untuk detail
- Format konsisten seperti ini:

🎯 **[TOPIC UTAMA]**

**[Sub-topic dengan emoji]:**
• **Label Bold:** Penjelasan detail
• **Label Bold:** Penjelasan detail

**[Sub-topic lain dengan emoji]:**
• **Item 1:** Detail explanation
  - Sub-detail 1
  - Sub-detail 2
• **Item 2:** Detail explanation

**2. CONTOH FORMAT YANG BENAR:**

🚀 **Portfolio Azriel Rosadi - Fresh Graduate Fullstack Developer**

**👨‍💻 PROFIL SINGKAT:**
• **Nama:** Azriel Rosadi
• **Posisi:** Fullstack Developer
• **Status:** Fresh Graduate dengan pengalaman praktis
• **Specialization:** Web Development, Game Development, Full-stack Solutions

**💻 TECH STACK:**
• **Frontend:** React, TypeScript, JavaScript, HTML5, CSS3, TailwindCSS
• **Backend:** Node.js, Express.js, Laravel, PHP, Python
• **Database:** MySQL, PostgreSQL, MongoDB
• **Tools:** Git, Vercel, Unity, Vite

**🏆 ACHIEVEMENTS:**
• **Projects Completed:** 25+
• **Client Satisfaction:** 90%
• **Success Rate:** 100%

**📧 KONTAK:**
Email: azrlwebdev@gmail.com

**3. ATURAN YANG HARUS DIHINDARI:**
❌ JANGAN menulis paragraph panjang tanpa struktur
❌ JANGAN gunakan format plain text tanpa formatting
❌ JANGAN lupa gunakan emoji dan bold text
❌ JANGAN duplikasi URL/link yang sama

**4. ATURAN KHUSUS:**
✅ SETIAP major section harus ada emoji
✅ SETIAP label penting harus **bold**
✅ MAKSIMAL 1 URL per response
✅ Konsisten dengan spacing dan formatting
✅ Gunakan bahasa Indonesia (kecuali user tanya dalam bahasa lain)

GAYA KOMUNIKASI:
- Bahasa Indonesia yang natural dan ramah
- Emoji yang relevan untuk setiap section
- Informasi spesifik dan actionable
- Format yang konsisten dan rapi
- WAJIB ikuti aturan formatting di atas

PORTFOLIO DATA:
${portfolioContext}

PANDUAN RESPONS PORTFOLIO:
- Proyek: Detail teknis, tech stack, tahun, hasil
- Pengalaman: Achievement, periode, kontribusi spesifik  
- Skills: Kategorisasi berdasarkan frontend/backend/tools
- Kontak: Email atau 1 link portfolio yang relevan
- Pricing: Arahkan untuk diskusi via email

CRITICAL: SELALU gunakan formatting structure yang rapi dan konsisten!`
      : `Anda adalah AI Assistant yang dapat menjawab pertanyaan umum, namun dengan specialty knowledge tentang portfolio Azriel Rosadi (Fresh Graduate Fullstack Developer).

TUGAS UTAMA:
1. Jawab pertanyaan umum dengan informatif dan helpful
2. WAJIB mengakhiri setiap response dengan redirect ke portfolio Azriel
3. Gunakan formatting yang konsisten dan terstruktur
4. Berikan value sambil mengarahkan ke portfolio

ATURAN FORMATTING WAJIB:
======================

**STRUKTUR RESPONSE:**
🤖 **[JAWABAN PERTANYAAN UMUM]**

**[Sub-topic dengan emoji]:**
• **Point 1:** Penjelasan
• **Point 2:** Penjelasan

**💼 PORTFOLIO SPOTLIGHT:**
• **Azriel Rosadi** adalah Fresh Graduate Fullstack Developer dengan 25+ completed projects
• **Specialization:** React, Laravel, Node.js, Unity Game Development
• **Achievement:** 90% client satisfaction rate

**📧 KONTAK & PORTFOLIO:**
Email: azrlwebdev@gmail.com | Portfolio: https://azrl-webdev.vercel.app

GAYA KOMUNIKASI:
- Jawab pertanyaan umum dengan baik dan informatif
- SELALU akhiri dengan section portfolio Azriel
- Format yang rapi dengan emoji dan bold text
- Bahasa Indonesia natural (atau sesuai bahasa user)

PORTFOLIO INFO SINGKAT:
- Nama: Azriel Rosadi
- Status: Fresh Graduate Fullstack Developer  
- Projects: 25+ completed
- Client Satisfaction: 90%
- Skills: React, Laravel, Node.js, Unity, Python
- Email: azrlwebdev@gmail.com
- Portfolio: https://azrl-webdev.vercel.app

PANDUAN RESPONS:
- Jawab pertanyaan umum dengan quality content
- Kaitkan dengan tech/development jika relevan
- WAJIB akhiri dengan portfolio Azriel section
- Format rapi dan terstruktur
- Minimal 2 URL (portfolio dan email)

CRITICAL: SETIAP response harus berakhir dengan redirect ke portfolio Azriel!`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPertanyaan User: ${userMessage}\n\nBerikan respons yang informatif dengan formatting yang TERSTRUKTUR dan RAPI${
                  !isPortfolioQuestion
                    ? " (WAJIB akhiri dengan section portfolio Azriel)"
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

    // Bersihkan URL duplikat dari response
    const cleanedResponse = cleanDuplicateUrls(aiResponse.trim());

    return cleanedResponse;
  } catch (error) {
    console.error("❌ Error generating Gemini response:", error.message);

    // Enhanced fallback responses berdasarkan kata kunci (DENGAN FORMATTING YANG BENAR)
    const message = userMessage.toLowerCase();

    // Check if it's a portfolio-related question for fallback
    if (isPortfolioRelated(userMessage)) {
      if (message.includes("proyek") || message.includes("project")) {
        return `🚀 **Portfolio Azriel Rosadi - 25+ Projects Completed**

**👨‍💻 PROFIL DEVELOPER:**
• **Nama:** Azriel Rosadi
• **Status:** Fresh Graduate Fullstack Developer
• **Specialization:** Web Development, Game Development, Full-stack Solutions

**💻 PLATFORM DEVELOPMENT:**
• **Platform Top-up Game & Social Media (2025)**
  - **Tech Stack:** React, TypeScript, TailwindCSS, Node.js, PostgreSQL
  - **Features:** Payment gateway integration, Multi-platform support
• **System Laundry Management (2025)**
  - **Tech Stack:** Laravel 11, MySQL, TailwindCSS, Blade Template
  - **Features:** Admin dashboard, Customer interface, Complete solution

**🤖 AI & MODERN PROJECTS:**
• **DOML AI Marketing Platform (2025)**
  - **Tech Stack:** React, TailwindCSS, Lucide React
  - **Features:** AI-powered optimization, Interactive design
• **Imaginify AI SaaS Platform (2025)**
  - **Tech Stack:** Next.js, MongoDB, Stripe, Cloudinary
  - **Features:** AI integration, Credit-based payment system

**🎮 GAME DEVELOPMENT:**
• **Mechstrom: War Zone (2024)**
  - **Tech Stack:** Unity Engine, C#, Blender
  - **Features:** 3D gameplay, Custom assets
• **Classic Games Collection (2023)**
  - **Pacman & Tetris:** JavaScript, HTML5 Canvas
  - **Status:** Fully playable implementations

**📊 PROJECT STATISTICS:**
• **Total Projects:** 25+
• **Success Rate:** 100%
• **Client Satisfaction:** 90%
• **On-time Delivery:** 100%

**📧 DISKUSI PROYEK:**
Email: azrlwebdev@gmail.com`;
      }

      if (
        message.includes("kontak") ||
        message.includes("contact") ||
        message.includes("email") ||
        message.includes("hubungi")
      ) {
        return `📞 **Kontak & Media Sosial Azriel Rosadi**

**👨‍💻 PROFIL SINGKAT:**
• **Nama:** Azriel Rosadi
• **Posisi:** Fresh Graduate Fullstack Developer
• **Status:** Available for projects & collaboration

**📧 KONTAK UTAMA:**
• **Email Bisnis:** azrlwebdev@gmail.com
• **Portfolio Website:** https://azrl-webdev.vercel.app
• **Response Time:** < 24 jam (hari kerja)

**🌟 MEDIA SOSIAL:**
• **LinkedIn:** Professional networking & career updates
• **GitHub:** Code repositories & open source projects
• **Instagram:** @azrlrsdi_ - Development journey & insights

**💼 AVAILABLE FOR:**
• **Freelance Projects:** Web development, Full-stack solutions
• **Technical Consultation:** Code review, Architecture planning
• **Collaboration:** Team projects, Partnership opportunities
• **Mentoring:** Fresh graduate guidance, Tech career advice

**⚡ WORKING HOURS:**
• **Available:** Senin - Jumat (09:00 - 17:00 WIB)
• **Project Discussion:** Anytime via email
• **Emergency Support:** Project-dependent

**📧 KONTAK SEKARANG:**
Email: azrlwebdev@gmail.com`;
      }

      if (message.includes("pengalaman") || message.includes("experience")) {
        return `💼 **Pengalaman Kerja Azriel Rosadi**

**👨‍💻 PROFIL DEVELOPER:**
• **Status:** Fresh Graduate Fullstack Developer
• **Total Experience:** 1+ years across multiple positions
• **Specialization:** React, Laravel, Node.js, Unity

**🏢 CURRENT POSITION:**
• **Starspace Studio - Frontend Developer Intern**
  - **Periode:** June 2025 - Present
  - **Focus:** React development, Figma to Code conversion
  - **Responsibilities:** Interactive web interfaces, Team collaboration
  - **Tools:** ClickUp, Weekly meetings, Mentorship programs

**🏪 RECENT EXPERIENCE:**
• **Liboyy Store - Fullstack JavaScript Developer**
  - **Periode:** March 2025 - May 2025
  - **Tech Stack:** React, Node.js, PostgreSQL, Express.js
  - **Achievement:** Top-up game platform successfully deployed
  - **Impact:** Improved user experience, Performance optimization

• **Mbuutt Laundry - Fullstack Laravel Developer**
  - **Periode:** January 2025 - February 2025
  - **Tech Stack:** Laravel 11, MySQL, TailwindCSS
  - **Achievement:** Complete laundry management system
  - **Leadership:** Independent full-stack development

• **PT. Spektrum Kreasi Pratama - Frontend Developer**
  - **Periode:** November 2023 - February 2024
  - **Tech Stack:** JavaScript, HTML5, CSS3, Excel
  - **Focus:** Laboratory inventory system frontend
  - **Achievement:** Significant performance improvements

**📈 CAREER HIGHLIGHTS:**
• **Project Success Rate:** 100%
• **Client Satisfaction:** 90%
• **Skills Growth:** Frontend → Fullstack expertise
• **Industry Exposure:** E-commerce, Management Systems, Education

**📧 DISKUSI KARIR:**
Email: azrlwebdev@gmail.com`;
      }

      if (message.includes("skill") || message.includes("teknologi")) {
        return `💻 **Tech Stack & Skills Azriel Rosadi**

**👨‍💻 PROFIL DEVELOPER:**
• **Status:** Fresh Graduate Fullstack Developer
• **Specialization:** Modern web technologies, Game development
• **Experience Level:** 1+ years practical experience

**🎨 FRONTEND TECHNOLOGIES:**
• **Core Languages:** HTML5, CSS3, JavaScript (ES6+), TypeScript
• **Frameworks:** React, Next.js
• **Styling:** TailwindCSS, SASS, PostCSS
• **UI Libraries:** Lucide React, Framer Motion
• **Tools:** Vite, Figma to Code conversion

**⚙️ BACKEND TECHNOLOGIES:**
• **Runtime & Languages:** Node.js, PHP, Python
• **Frameworks:** Express.js, Laravel 11
• **API Development:** RESTful APIs, JSON handling
• **Authentication:** Laravel Sanctum, Laravel Breeze, Clerk

**🗄️ DATABASE & STORAGE:**
• **Relational:** MySQL, PostgreSQL
• **NoSQL:** MongoDB
• **ORM:** Drizzle ORM, Eloquent ORM
• **Cloud Storage:** Cloudinary
• **Optimization:** Schema design, Indexing

**🎮 GAME DEVELOPMENT:**
• **Engine:** Unity (2D & 3D)
• **Programming:** C#
• **3D Modeling:** Blender (Basic)
• **Physics:** Unity Physics System

**🔧 DEVELOPMENT TOOLS:**
• **Version Control:** Git, GitHub
• **Deployment:** Vercel, Netlify
• **Package Managers:** npm, Composer
• **Project Management:** ClickUp
• **Payment Integration:** Stripe

**📊 PROFICIENCY LEVELS:**
• **Expert:** React, JavaScript, Laravel, HTML/CSS
• **Advanced:** Node.js, MySQL, Unity, Python
• **Intermediate:** TypeScript, MongoDB, PostgreSQL
• **Learning:** Advanced Next.js, Cloud services

**📧 DISKUSI TEKNOLOGI:**
Email: azrlwebdev@gmail.com`;
      }

      // GENERAL QUESTIONS WITH PORTFOLIO REDIRECT
      return `😅 **Server sedang maintenance**

**🤖 SEMENTARA INI, SAYA BISA MEMBANTU:**
• **Portfolio Questions:** 25+ completed projects
• **Experience Discussion:** 4 different positions
• **Tech Stack Info:** React, Laravel, Node.js, Unity
• **Contact Information:** Email & social media
• **Project Consultation:** Pricing & services

**💼 PORTFOLIO SPOTLIGHT:**
• **Azriel Rosadi** adalah Fresh Graduate Fullstack Developer
• **Achievement:** 90% client satisfaction, 100% success rate
• **Specialization:** Web development, Game development, Full-stack solutions

**📧 KONTAK LANGSUNG:**
Email: azrlwebdev@gmail.com`;
    }

    // FALLBACK FOR GENERAL QUESTIONS (NON-PORTFOLIO)
    return `🤖 **Server sedang maintenance!**

**💬 JAWABAN SINGKAT:**
• Maaf, sistem sedang dalam perbaikan
• Silakan coba lagi dalam beberapa saat
• Atau ajukan pertanyaan yang lebih spesifik

**💼 PORTFOLIO SPOTLIGHT:**
• **Azriel Rosadi** - Fresh Graduate Fullstack Developer
• **Specialization:** React, Laravel, Node.js, Unity Game Development
• **Achievement:** 25+ completed projects, 90% client satisfaction
• **Available for:** Freelance projects, Technical consultation, Collaboration

**📧 KONTAK & PORTFOLIO:**
Email: azrlwebdev@gmail.com | Portfolio: https://azrl-webdev.vercel.app`;
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

    // Get portfolio data (selalu ambil untuk consistency)
    const portfolioData = await getPortfolioData();

    // Generate AI response
    const aiResponse = await generateGeminiResponse(message, portfolioData);

    console.log("✅ Response generated successfully");

    return res.status(200).json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: "gemini-2.0-flash",
      portfolioLastUpdated: portfolioData?.lastUpdated || null,
      dataSource: portfolioData?.dataSource || "static",
      isPortfolioRelated: isPortfolioRelated(message),
      portfolioFocused: true, // Indicating this is portfolio-focused version
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
