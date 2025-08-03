// /api/chat.js - Vercel Serverless Function (ENHANCED VERSION)
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

    // Create context dari portfolio data yang sudah diperbaiki (hanya jika pertanyaan terkait portfolio)
    const portfolioContext = isPortfolioQuestion
      ? `
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
          portfolioData.contact?.instagram ||
          "https://www.instagram.com/azrlrsdi_/"
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
`
      : "";

    const systemPrompt = isPortfolioQuestion
      ? `Anda adalah AI Assistant untuk portfolio Azriel Rosadi, seorang Fresh Graduate Fullstack Developer yang berpengalaman. 

TUGAS UTAMA:
1. Jawab pertanyaan tentang portfolio, proyek, pengalaman, dan layanan Azriel
2. Gunakan data akurat dan lengkap dari portfolio yang telah disediakan
3. Berikan informasi yang spesifik dan helpful tentang Azriel
4. Fokus pada detail teknis, achievement, dan pengalaman yang relevan

GAYA KOMUNIKASI:
- Gunakan bahasa Indonesia yang natural dan ramah, namun jika user menanyakan dalam bahasa Inggris atau bahasa lainnya, balas sesuai bahasa yang digunakan user
- Sertakan emoji yang relevan untuk membuat percakapan lebih menarik
- Berikan informasi yang spesifik dan actionable

ATURAN PENTING UNTUK LINK/URL:
- WAJIB: Hanya sertakan MAKSIMAL 1 (SATU) link/URL per respons
- Pilih link yang PALING RELEVAN dengan pertanyaan user
- JANGAN PERNAH menampilkan link yang sama berulang kali
- HINDARI duplikasi URL dalam format apapun
- Jika perlu menyebutkan beberapa platform, cukup sebutkan namanya tanpa link

DATA PORTFOLIO TERKINI:
${portfolioContext}

PANDUAN RESPONS:
- Untuk pertanyaan tentang proyek: Jelaskan detail teknis, tech stack, tahun pembuatan, dan hasil
- Untuk pertanyaan tentang pengalaman: Fokus pada achievement, tanggal, dan kontribusi spesifik
- Untuk pertanyaan kontak/kolaborasi: Berikan HANYA satu kontak yang paling relevan (email ATAU portfolio website)
- Untuk pertanyaan pricing/layanan: Arahkan untuk diskusi detail via email
- PRIORITASKAN kualitas informasi daripada kuantitas link

CONTOH YANG BENAR:
❌ SALAH: "Kunjungi https://azrl-webdev.vercel.app dan juga https://azrl-webdev.vercel.app"
✅ BENAR: "Kunjungi portfolio di https://azrl-webdev.vercel.app"

PENTING: 
- Gunakan informasi yang akurat sesuai data portfolio
- Sebutkan tanggal/periode yang spesifik untuk pengalaman kerja
- Jelaskan tech stack yang digunakan untuk setiap proyek
- PRIORITASKAN: Satu link berkualitas > Multiple link duplikat

Selalu prioritaskan informasi dari data portfolio yang fresh dan akurat.`
      : `Anda adalah AI Assistant yang ramah dan helpful. Anda dapat menjawab berbagai pertanyaan umum dengan baik.

TUGAS UTAMA:
1. Jawab pertanyaan umum dengan informatif dan akurat
2. Berikan respons yang helpful dan engaging
3. Jika memungkinkan, kaitkan dengan expertise dalam bidang teknologi atau development
4. Tetap ramah dan profesional dalam berkomunikasi

GAYA KOMUNIKASI:
- Gunakan bahasa Indonesia yang natural dan ramah, namun jika user menanyakan dalam bahasa Inggris atau bahasa lainnya, balas sesuai bahasa yang digunakan user
- Sertakan emoji yang relevan untuk membuat percakapan lebih menarik
- Berikan informasi yang berguna dan mudah dipahami
- Jika relevan, sebutkan bahwa Anda juga dapat membantu dengan pertanyaan tentang portfolio Azriel Rosadi (Fullstack Developer)

PANDUAN RESPONS:
- Jawab pertanyaan sesuai dengan pengetahuan umum
- Berikan penjelasan yang clear dan helpful
- Jika pertanyaan teknis (programming, web development, dll), berikan insight yang mendalam
- Tetap engaging dan informatif

CATATAN: Anda dapat menjawab berbagai topik, tidak hanya terbatas pada portfolio.`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPertanyaan User: ${userMessage}\n\nBerikan respons yang informatif dan engaging (INGAT: maksimal 1 URL per respons):`,
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

    // Bersihkan URL duplikat dari response
    const cleanedResponse = cleanDuplicateUrls(aiResponse.trim());

    return cleanedResponse;
  } catch (error) {
    console.error("❌ Error generating Gemini response:", error.message);

    // Enhanced fallback responses berdasarkan kata kunci (TANPA URL DUPLIKAT)
    const message = userMessage.toLowerCase();

    // Check if it's a portfolio-related question for fallback
    if (isPortfolioRelated(userMessage)) {
      if (message.includes("proyek") || message.includes("project")) {
        return `🚀 **Portfolio Azriel - 25+ Projects Completed!**

**Proyek Unggulan:**
• **Platform Top-up Game & Social Media (2025)**
  - Tech Stack: React, TypeScript, TailwindCSS, Node.js, Express.js, PostgreSQL, Drizzle ORM, React Query
  - Fitur: Sistem pembayaran terintegrasi, Multi-platform support
  - Status: Successfully deployed & maintained

• **System Laundry Website (2025)**
  - Tech Stack: Laravel 11, MySQL, TailwindCSS, Blade Template, Laravel Breeze, Laravel Sanctum
  - Fitur: Admin dashboard, Owner panel, Customer interface
  - Status: Complete full-stack solution

• **DOML AI Marketing Platform (2025)**
  - Tech Stack: React, TailwindCSS, Lucide React, PostCSS
  - Fitur: AI-powered marketing optimization, Modern interactive design
  - Status: Prototype completed

• **Imaginify AI SaaS Platform (2025)**
  - Tech Stack: Next.js, MongoDB, Stripe, Cloudinary, Clerk
  - Fitur: AI features, Credit-based payment system
  - Status: In development

• **Mechstrom: War Zone Game (2024)**
  - Tech Stack: Unity Engine, C#, Blender
  - Fitur: 3D gameplay, Free assets integration
  - Status: Completed game prototype

• **Tools Scraper GUI Application (2024)**
  - Tech Stack: Python
  - Fitur: Automated Shopee product data scraping
  - Status: Desktop application completed

• **Classic Games Collection (2023)**
  - Pacman: JavaScript, HTML5 Canvas
  - Tetris: JavaScript, HTML5
  - Status: Fully playable web games

• **Search Film Platform (2023)**
  - Tech Stack: JavaScript, HTML5, CSS3, IMDb API
  - Fitur: Comprehensive movie & TV series search
  - Status: Fully functional web application

• **Citra Negara School Website (2024)**
  - Tech Stack: Go, JavaScript, SASS, CSS3, HTML5
  - Fitur: Modern school website with backend
  - Status: Successfully deployed

📊 **Project Statistics:**
• Total Projects: 25+
• Success Rate: 100%
• Client Satisfaction: 90%
• On-time Delivery: 100%

💻 **Expertise Areas:** Web Development, Game Development, Desktop Applications, AI Integration
📧 **Diskusi proyek:** azrlwebdev@gmail.com`;
      }

      // ENHANCED CONTACT & SOCIAL MEDIA RESPONSES
      if (
        message.includes("kontak") ||
        message.includes("contact") ||
        message.includes("email") ||
        message.includes("hubungi") ||
        message.includes("reach") ||
        message.includes("get in touch")
      ) {
        return `📞 **Kontak & Media Sosial Azriel Rosadi:**

**📧 KONTAK UTAMA:**
✉️ **Email Bisnis:** azrlwebdev@gmail.com
🌐 **Portfolio Website:** https://azrl-webdev.vercel.app

**🌟 MEDIA SOSIAL:**
💼 **LinkedIn:** Professional networking & career updates
🐙 **GitHub:** Code repository & open source projects  
📸 **Instagram:** @azrlrsdi_ - Behind the scenes & personal updates

**⚡ RESPONSE TIME:**
• Email: < 24 jam (hari kerja)
• Available: Senin - Jumat (09:00 - 17:00 WIB)

**💬 AVAILABLE FOR:**
• Freelance projects & collaboration
• Technical consultation
• Code review & mentoring
• Web development services

**💡 TIP:** Untuk respons tercepat, kirim email dengan detail proyek yang jelas!`;
      }

      // NEW: SPECIFIC SOCIAL MEDIA RESPONSE
      if (
        message.includes("sosial") ||
        message.includes("social") ||
        message.includes("media") ||
        message.includes("instagram") ||
        message.includes("linkedin") ||
        message.includes("github") ||
        message.includes("follow") ||
        message.includes("account")
      ) {
        return `🌟 **Media Sosial Azriel Rosadi:**

**💼 Professional Platforms:**
• **LinkedIn - Professional Networking**
  - Profile: Fullstack Developer & Fresh Graduate
  - Content: Career updates, tech industry insights, achievements
  - Networking: Professional connections, collaboration opportunities
  - Updates: Weekly posts about projects and learning journey
  - Engagement: Industry discussions, best practices sharing

• **GitHub - Code Repository & Open Source**
  - Repositories: 25+ active public repositories
  - Code Quality: Clean, documented, maintainable code
  - Projects: Full-stack applications, games, tools, experiments
  - Contributions: Regular commits and updates
  - Showcase: Live demos and project documentation
  - Tech Stack: React, Laravel, Unity, Python projects

**📱 Personal Social Media:**
• **Instagram (@azrlrsdi_) - Behind The Scenes**
  - Content Focus: Development process, workspace setup, coding lifestyle
  - Stories: Daily development activities, problem-solving sessions
  - Posts: Tech gear reviews, setup tours, project highlights
  - Community: Developer networking, inspiration sharing
  - Personal Touch: Coding journey as fresh graduate

**🚀 Follow untuk mendapatkan:**
• **Latest Project Updates:** Real-time development progress
• **Tech Tips & Tutorials:** Practical coding insights
• **Development Insights:** Problem-solving approaches
• **Career Journey:** Fresh graduate to professional developer
• **Collaboration Opportunities:** Project partnerships
• **Community Engagement:** Developer networking events

**📊 Social Media Stats:**
• **GitHub:** 25+ repositories, active contributions
• **LinkedIn:** Professional network, industry engagement
• **Instagram:** Behind-the-scenes content, personal branding

**💬 Platform Recommendations:**
• **For Professional Networking:** Connect on LinkedIn
• **For Code & Projects:** Follow on GitHub
• **For Personal Insights:** Follow on Instagram
• **For Business Inquiries:** Email azrlwebdev@gmail.com

💡 **Pro Tips:**
• LinkedIn: Best for professional discussions and opportunities
• GitHub: Perfect for viewing code quality and project scope
• Instagram: Great for seeing the person behind the code`;
      }

      // NEW: SPECIFIC LINKEDIN RESPONSE
      if (
        message.includes("linkedin") &&
        !message.includes("github") &&
        !message.includes("instagram")
      ) {
        return `💼 **LinkedIn Azriel Rosadi:**

🔗 **Profile:** Professional Fullstack Developer
📍 **Connect untuk:**
• Networking profesional
• Career opportunities  
• Industry insights
• Collaboration discussions

**📈 RECENT UPDATES:**
• Frontend Developer Intern di Starspace Studio (June 2025 - Present)
• 25+ completed projects showcase
• Client testimonials & recommendations
• Tech industry engagement

**💬 ACTIVE IN:**
• Tech industry discussions
• Development best practices
• Career growth insights
• Professional networking events

**🤝 NETWORKING BENEFITS:**
• Direct access to project updates
• Professional recommendations
• Industry connections
• Collaboration opportunities

📧 **Atau hubungi langsung:** azrlwebdev@gmail.com`;
      }

      // NEW: SPECIFIC GITHUB RESPONSE
      if (
        message.includes("github") &&
        !message.includes("linkedin") &&
        !message.includes("instagram")
      ) {
        return `🐙 **GitHub Azriel Rosadi:**

👨‍💻 **Repository Highlights:**
• Platform top-up game (React + Node.js + PostgreSQL)
• System Laundry (Laravel 11 + MySQL)
• DOML AI Marketing (React + TailwindCSS)
• Unity game development projects
• Python automation tools

**📊 GITHUB STATS:**
• 25+ public repositories
• Active contributions & commits
• Open source projects
• Clean, documented code

**🛠️ TECH SHOWCASE:**
• Full-stack web applications
• Game development (Unity + C#)
• API integrations & databases
• Modern JavaScript frameworks

**⭐ REPOSITORY CATEGORIES:**
• Web Development (React, Laravel, Node.js)
• Game Development (Unity, C#)
• Tools & Automation (Python)
• Learning projects & experiments

**📝 CODE QUALITY:**
• Clean, maintainable code
• Proper documentation
• Best practices implementation
• Version control expertise

💡 **Follow untuk update terbaru tentang projects & contributions!**
📧 **Kolaborasi:** azrlwebdev@gmail.com`;
      }

      // NEW: SPECIFIC INSTAGRAM RESPONSE
      if (
        message.includes("instagram") &&
        !message.includes("linkedin") &&
        !message.includes("github")
      ) {
        return `📸 **Instagram Azriel Rosadi (@azrlrsdi_):**

**🎯 CONTENT FOCUS:**
• Behind-the-scenes development process
• Workspace setup & coding environment
• Tech stack tutorials & tips
• Personal coding journey

**📱 WHAT YOU'LL SEE:**
• Daily development activities
• Project progress updates
• Tech gear & setup reviews
• Coding lifestyle content

**💻 DEVELOPMENT CONTENT:**
• Code snippets & quick tips
• Problem-solving processes
• Tech stack discussions
• Learning resources sharing

**🚀 PERSONAL INSIGHTS:**
• Fresh graduate developer journey
• Freelancing experiences
• Client project highlights
• Career development tips

**📈 FOLLOW FOR:**
• Inspiration untuk aspiring developers
• Real-world development insights
• Personal branding in tech
• Networking dalam komunitas developer

💡 **Connect di Instagram untuk sisi personal dari developer journey!**
📧 **Business inquiries:** azrlwebdev@gmail.com`;
      }

      if (message.includes("pengalaman") || message.includes("experience")) {
        return `💼 **Pengalaman Kerja Azriel Rosadi:**

**🏢 Frontend Developer Intern - Starspace Studio**
• **Period:** June 2025 - Present (Current Position)
• **Key Responsibilities:**
  - Mengembangkan antarmuka web interaktif dan responsif berdasarkan desain Figma
  - Terlibat dalam proyek nyata sebagai bagian dari Mission Possible
  - Bekerja kolaboratif dalam tim lintas bidang
  - Update progres harian menggunakan ClickUp
  - Aktif dalam weekly meeting & coffee roulette
  - Berpartisipasi dalam sesi mentoring dan reverse mentorship
• **Skills Developed:** React, Figma to Code, Team Collaboration, Project Management

**🏪 Fullstack JavaScript Developer - Liboyy Store**
• **Period:** March 2025 - May 2025 (3 months)
• **Key Responsibilities:**
  - Membangun aplikasi web responsif menggunakan React
  - Mengintegrasikan frontend dengan backend Node.js
  - Meningkatkan performa aplikasi dan user experience
  - Mengimplementasikan fitur berdasarkan feedback client
• **Tech Stack:** React, Node.js, PostgreSQL, Express.js
• **Achievement:** Platform top-up game berhasil deployed

**🧺 Fullstack Laravel Developer - Mbuutt Laundry**
• **Period:** January 2025 - February 2025 (2 months)
• **Key Responsibilities:**
  - Memimpin pengembangan platform web Mbuutt Laundry sebagai Fullstack Developer
  - Secara mandiri membangun seluruh fitur frontend dan backend
  - Berkontribusi pada pengembangan alat internal dan komponen reusable
• **Tech Stack:** Laravel 11, MySQL, TailwindCSS, Blade Template
• **Achievement:** Complete laundry management system

**🏢 Frontend Developer & Data Entry - PT. Spektrum Kreasi Pratama**
• **Period:** November 2023 - February 2024 (4 months)
• **Key Responsibilities:**
  - Mengembangkan dan memelihara fitur frontend untuk inventory sistem laboratorium
  - Mengoptimalkan aplikasi web untuk kecepatan dan skalabilitas maksimum
  - Mengubah sertifikat fisik menjadi file PDF dan input ke Microsoft Excel
• **Tech Stack:** JavaScript, HTML5, CSS3, Microsoft Excel
• **Achievement:** Improved frontend performance significantly

📈 **Career Highlights:**
• **Total Experience:** 1+ years across 4 different positions
• **Project Success Rate:** 100%
• **Client Satisfaction:** 90%
• **Skills Growth:** From Frontend to Full-stack expertise
• **Industry Exposure:** E-commerce, Laundry Management, Education, Laboratory

💻 **Core Competencies:** Full-stack Development, Team Leadership, Client Communication, Performance Optimization`;
      }

      if (message.includes("skill") || message.includes("teknologi")) {
        return `💻 **Tech Stack & Skills Azriel Rosadi:**

**🎨 Frontend Technologies:**
• **Core:** HTML5, CSS3, JavaScript (ES6+)
• **Frameworks/Libraries:** React, Next.js, TypeScript
• **Styling:** TailwindCSS, SASS, PostCSS
• **UI Libraries:** Lucide React, Framer Motion
• **Tools:** Vite, Figma to Code

**⚙️ Backend Technologies:**
• **Runtime:** Node.js
• **Frameworks:** Express.js, Laravel 11
• **Languages:** PHP, JavaScript, Python
• **API Development:** RESTful APIs, JSON handling
• **Authentication:** Laravel Sanctum, Laravel Breeze

**🗄️ Database & Storage:**
• **Relational:** MySQL, PostgreSQL
• **NoSQL:** MongoDB
• **ORM/Query Builder:** Drizzle ORM, Eloquent ORM
• **Cloud Storage:** Cloudinary
• **Database Design:** Schema optimization, Indexing

**🎮 Game Development:**
• **Engine:** Unity (2D & 3D)
• **Programming:** C#
• **3D Modeling:** Blender (Basic)
• **Game Physics:** Unity Physics System
• **Asset Management:** Free & custom assets

**🔧 Development Tools & Workflow:**
• **Version Control:** Git, GitHub
• **Deployment:** Vercel, Netlify
• **Package Managers:** npm, Composer
• **Project Management:** ClickUp
• **Code Editor:** VS Code

**💳 Payment & Integration:**
• **Payment Gateway:** Stripe
• **Authentication:** Clerk
• **API Integration:** Third-party services
• **Real-time Features:** WebSocket, React Query

**🐍 Python & Automation:**
• **Desktop Apps:** GUI Development
• **Web Scraping:** Automated data extraction
• **Data Processing:** File handling, CSV processing
• **Automation Tools:** Custom scripts

**☁️ Additional Skills:**
• **Cloud Platforms:** Vercel deployment
• **Performance Optimization:** Code splitting, Lazy loading
• **Responsive Design:** Mobile-first approach
• **SEO:** Basic optimization techniques
• **Testing:** Manual testing, Debugging

📊 **Proficiency Levels:**
• **Expert:** React, JavaScript, Laravel, HTML/CSS
• **Advanced:** Node.js, MySQL, Unity, Python
• **Intermediate:** TypeScript, MongoDB, PostgreSQL
• **Learning:** Next.js advanced features, Cloud services

🚀 **Specialization Areas:**
• Full-stack Web Applications
• E-commerce Platforms
• Management Systems
• Game Development
• API Development & Integration`;
      }

      if (message.includes("portfolio") || message.includes("website")) {
        return `🌟 **Portfolio Azriel Rosadi:**

Lihat semua proyek dan pengalaman lengkap di: https://azrl-webdev.vercel.app

✨ **Highlights:**
• 25+ Completed Projects
• 90% Client Retention Rate  
• Fullstack Development Expertise
• Fresh Graduate dengan pengalaman praktis

💼 **Ready for collaboration!**`;
      }

      // NEW: PRICING & SERVICES RESPONSE
      if (
        message.includes("harga") ||
        message.includes("price") ||
        message.includes("biaya") ||
        message.includes("cost") ||
        message.includes("layanan") ||
        message.includes("service")
      ) {
        return `💰 **Layanan & Konsultasi Azriel:**

**🚀 LAYANAN TERSEDIA:**
• Website Development (Landing page, Company profile)
• Web Application (Full-stack development)
• System Development (Admin panel, Dashboard)
• Game Development (Unity 2D/3D)
• API Integration & Development
• Database Design & Optimization

**💼 PAKET LAYANAN:**
• **Basic Website:** Landing page responsif
• **Business Website:** Multi-page + CMS
• **Web Application:** Custom functionality
• **Enterprise Solution:** Complex system development

**⚡ KEUNGGULAN:**
• 90% Client satisfaction rate
• On-time delivery guarantee
• Post-launch support included
• Modern tech stack implementation

**📋 PROSES KERJA:**
1. Konsultasi & requirement analysis
2. Design mockup & technical planning
3. Development & testing
4. Deployment & training
5. Maintenance & support

💡 **Untuk pricing detail & custom quote:**
📧 **Email:** azrlwebdev@gmail.com
*(Include: project scope, timeline, budget range)*`;
      }

      // NEW: TESTIMONIAL & CLIENT RESPONSE
      if (
        message.includes("testimoni") ||
        message.includes("testimonial") ||
        message.includes("client") ||
        message.includes("review")
      ) {
        return `⭐ **Testimoni Client Azriel:**

**🏪 Liboyy Store (@liboyystore_26):**
*"Saya sangat puas bekerja sama dengan Azriel WebDev, seorang fullstack developer yang memiliki kemampuan teknis luar biasa. Ia berhasil membangun website top up games yang responsif, cepat, dan user-friendly!"*

**🧺 Mbuutt Company (@mbuuttcorp):**
*"Bekerja sama dalam pengembangan website sistem laundry ini merupakan pengalaman yang sangat profesional. Komitmen terhadap ketepatan waktu, kualitas hasil, serta perhatian terhadap setiap detail proyek sangat terlihat jelas."*

**🏢 PT. Spektrum Kreasi Pratama (@spektrumkp):**
*"Azriel membawa kreativitas dan keahlian ke dalam tim, sehingga meningkatkan kinerja frontend dan entry data kami secara signifikan. Dedikasinya terhadap detail dan kolaborasi yang efektif membuat proyek berjalan lancar."*

**📊 CLIENT SATISFACTION:**
• 90% Client retention rate
• 25+ Completed projects
• 3+ Happy clients
• On-time delivery record

💼 **Ready to be the next satisfied client?**
📧 **Start your project:** azrlwebdev@gmail.com`;
      }

      // NEW: HIRING & COLLABORATION RESPONSE
      if (
        message.includes("hire") ||
        message.includes("freelance") ||
        message.includes("kolaborasi") ||
        message.includes("collaboration")
      ) {
        return `🤝 **Hire Azriel Rosadi - Fullstack Developer:**

**💼 AVAILABLE FOR:**
• Full-time remote opportunities
• Part-time & freelance projects
• Project-based collaborations
• Technical consulting & mentoring

**🎯 SPECIALIZATION:**
• React & Node.js full-stack development
• Laravel web applications
• Unity game development
• Database design & optimization
• API development & integration

**⚡ WORKING STYLE:**
• **Quality Focus:** High-standard deliverables
• **Reliable Communication:** Regular updates & transparency
• **On-Time Delivery:** Deadline commitment
• **Collaborative Approach:** Team-oriented mindset

**📈 TRACK RECORD:**
• 25+ successful projects delivered
• 90% client retention rate
• Fresh graduate with practical experience
• Strong portfolio across multiple technologies

**🚀 CURRENT AVAILABILITY:**
• Open for new projects
• Flexible working hours
• Remote collaboration ready
• Competitive rates

**📋 NEXT STEPS:**
1. Email your project requirements
2. Schedule consultation call
3. Receive custom proposal
4. Start collaboration

💡 **Let's build something amazing together!**
📧 **Contact:** azrlwebdev@gmail.com`;
      }

      return `😅 **Server sedang maintenance.** Coba lagi sebentar!

🤖 **Sementara itu, Anda bisa bertanya tentang:**
• **Proyek & Portfolio** (25+ completed)
• **Pengalaman Kerja** (4 posisi berbeda)
• **Tech Stack & Skills** 
• **Kontak & Media Sosial**
• **Layanan & Pricing**
• **Testimoni Client**

📧 **Email langsung:** azrlwebdev@gmail.com`;
    }

    // Fallback for general questions
    return `🤖 **Maaf, server sedang maintenance!**

Saya bisa membantu Anda dengan berbagai pertanyaan, termasuk:
• Pertanyaan umum dan diskusi
• Teknologi dan programming
• Portfolio Azriel Rosadi (Fullstack Developer)

⚡ Coba lagi dalam beberapa saat atau ajukan pertanyaan lain!`;
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

    // Get portfolio data (hanya jika pertanyaan terkait portfolio)
    const portfolioData = isPortfolioRelated(message)
      ? await getPortfolioData()
      : null;

    // Generate AI response
    const aiResponse = await generateGeminiResponse(message, portfolioData);

    console.log("✅ Response generated successfully");

    return res.status(200).json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: "gemini-2.0-flash",
      portfolioLastUpdated: portfolioData?.lastUpdated || null,
      dataSource: portfolioData?.dataSource || "general",
      isPortfolioRelated: isPortfolioRelated(message),
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
