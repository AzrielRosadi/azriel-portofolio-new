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
- STRUKTUR response dengan format yang rapi dan mudah dibaca menggunakan bullets dan header yang jelas

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
- SELALU struktur response dengan format yang rapi menggunakan bullets dan header

CONTOH YANG BENAR:
❌ SALAH: "Kunjungi https://azrl-webdev.vercel.app dan juga https://azrl-webdev.vercel.app"
✅ BENAR: "Kunjungi portfolio di https://azrl-webdev.vercel.app"

PENTING: 
- Gunakan informasi yang akurat sesuai data portfolio
- Sebutkan tanggal/periode yang spesifik untuk pengalaman kerja
- Jelaskan tech stack yang digunakan untuk setiap proyek
- PRIORITASKAN: Satu link berkualitas > Multiple link duplikat
- STRUKTUR response dengan header dan bullets yang jelas

Selalu prioritaskan informasi dari data portfolio yang fresh dan akurat dengan format yang rapi dan terstruktur.`
      : `Anda adalah AI Assistant yang ramah dan helpful. Anda dapat menjawab berbagai pertanyaan umum dengan baik.

TUGAS UTAMA:
1. Jawab pertanyaan umum dengan informatif dan akurat
2. Berikan respons yang helpful dan engaging
3. Jika memungkinkan, kaitkan dengan expertise dalam bidang teknologi atau development
4. Tetap ramah dan profesional dalam berkomunikasi
5. STRUKTUR response dengan format yang rapi dan mudah dibaca

GAYA KOMUNIKASI:
- Gunakan bahasa Indonesia yang natural dan ramah, namun jika user menanyakan dalam bahasa Inggris atau bahasa lainnya, balas sesuai bahasa yang digunakan user
- Sertakan emoji yang relevan untuk membuat percakapan lebih menarik
- Berikan informasi yang berguna dan mudah dipahami
- STRUKTUR response dengan bullets dan header yang jelas
- Jika relevan, sebutkan bahwa Anda juga dapat membantu dengan pertanyaan tentang portfolio Azriel Rosadi (Fullstack Developer)

PANDUAN RESPONS:
- Jawab pertanyaan sesuai dengan pengetahuan umum
- Berikan penjelasan yang clear dan helpful
- Jika pertanyaan teknis (programming, web development, dll), berikan insight yang mendalam
- Tetap engaging dan informatif
- Gunakan format yang terstruktur dengan header dan bullets

CATATAN: Anda dapat menjawab berbagai topik, tidak hanya terbatas pada portfolio.`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPertanyaan User: ${userMessage}\n\nBerikan respons yang informatif dan engaging dengan format yang terstruktur (INGAT: maksimal 1 URL per respons):`,
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

    // Enhanced fallback responses berdasarkan kata kunci (STRUCTURED FORMAT)
    const message = userMessage.toLowerCase();

    // Check if it's a portfolio-related question for fallback
    if (isPortfolioRelated(userMessage)) {
      if (message.includes("proyek") || message.includes("project")) {
        return `## 🚀 Portfolio Projects - Azriel Rosadi

### 📊 Project Statistics:
* **Total Projects:** 25+ Completed
* **Success Rate:** 100%
* **Client Satisfaction:** 90%
* **On-time Delivery:** 100%

### 🌟 Featured Projects:

#### **1. Platform Top-up Game & Social Media (2025)**
* **Description:** Platform web untuk layanan top-up game dan sosial media
* **Tech Stack:** React, TypeScript, TailwindCSS, Node.js, Express.js, PostgreSQL, Drizzle ORM, React Query
* **Features:** 
  - Sistem pembayaran terintegrasi
  - Multi-platform support
  - Real-time transaction processing
* **Status:** Successfully deployed & maintained

#### **2. System Laundry Website (2025)**
* **Description:** Sistem manajemen laundry lengkap
* **Tech Stack:** Laravel 11, MySQL, TailwindCSS, Blade Template, Laravel Breeze, Laravel Sanctum
* **Features:**
  - Admin dashboard
  - Owner management panel
  - Customer interface
  - Order tracking system
* **Status:** Complete full-stack solution

#### **3. DOML AI Marketing Platform (2025)**
* **Description:** Landing page prototype untuk platform marketing berbasis AI
* **Tech Stack:** React, TailwindCSS, Lucide React, PostCSS
* **Features:**
  - AI-powered marketing optimization
  - Modern interactive design
  - Responsive layout
* **Status:** Prototype completed

#### **4. Imaginify AI SaaS Platform (2025)**
* **Description:** Platform SaaS dengan fitur AI dan sistem pembayaran credits
* **Tech Stack:** Next.js, MongoDB, Stripe, Cloudinary, Clerk
* **Features:**
  - AI image processing
  - Credit-based payment system
  - User authentication
* **Status:** In development

#### **5. Game Development Projects (2024)**
* **Mechstrom: War Zone**
  - **Tech Stack:** Unity Engine, C#, Blender
  - **Features:** 3D gameplay, Physics system
  - **Status:** Completed game prototype

#### **6. Web Applications (2023-2024)**
* **Search Film Platform**
  - **Tech Stack:** JavaScript, HTML5, CSS3, IMDb API
  - **Features:** Movie & TV series search, Comprehensive database
* **Classic Games Collection**
  - **Pacman:** JavaScript, HTML5 Canvas
  - **Tetris:** JavaScript, HTML5
* **Citra Negara School Website**
  - **Tech Stack:** Go, JavaScript, SASS, CSS3, HTML5

#### **7. Desktop Applications (2024)**
* **Tools Scraper GUI Application**
  - **Tech Stack:** Python
  - **Features:** Automated Shopee product data scraping
  - **Status:** Desktop application completed

### 💻 Expertise Areas:
* **Web Development:** Full-stack applications, E-commerce platforms
* **Game Development:** Unity 3D/2D, Interactive gameplay
* **Desktop Applications:** GUI development, Automation tools
* **AI Integration:** Modern AI-powered solutions
* **API Development:** RESTful services, Database integration

### 📧 Project Discussion:
**Email:** azrlwebdev@gmail.com`;
      }

      if (message.includes("pengalaman") || message.includes("experience")) {
        return `## 💼 Professional Experience - Azriel Rosadi

### 🏢 Work History:

#### **1. Frontend Developer Intern - Starspace Studio**
* **Period:** June 2025 - Present (Current Position)
* **Duration:** 2+ months (Ongoing)
* **Key Responsibilities:**
  - Mengembangkan antarmuka web interaktif dan responsif berdasarkan desain Figma
  - Terlibat dalam proyek nyata sebagai bagian dari Mission Possible
  - Bekerja kolaboratif dalam tim lintas bidang
  - Update progres harian menggunakan ClickUp
  - Aktif dalam weekly meeting & coffee roulette
  - Berpartisipasi dalam sesi mentoring dan reverse mentorship
* **Skills Developed:** React, Figma to Code, Team Collaboration, Project Management
* **Achievement:** Successfully contributing to real-world projects with professional team

#### **2. Fullstack JavaScript Developer - Liboyy Store**
* **Period:** March 2025 - May 2025
* **Duration:** 3 months
* **Key Responsibilities:**
  - Membangun aplikasi web responsif menggunakan React
  - Mengintegrasikan frontend dengan backend Node.js
  - Meningkatkan performa aplikasi dan user experience
  - Mengimplementasikan fitur berdasarkan feedback client
* **Tech Stack:** React, Node.js, PostgreSQL, Express.js, TypeScript
* **Achievement:** Platform top-up game berhasil deployed dengan performa optimal

#### **3. Fullstack Laravel Developer - Mbuutt Laundry**
* **Period:** January 2025 - February 2025
* **Duration:** 2 months
* **Key Responsibilities:**
  - Memimpin pengembangan platform web Mbuutt Laundry sebagai Fullstack Developer
  - Secara mandiri membangun seluruh fitur frontend dan backend
  - Berkontribusi pada pengembangan alat internal dan komponen reusable
* **Tech Stack:** Laravel 11, MySQL, TailwindCSS, Blade Template, Laravel Breeze, Laravel Sanctum
* **Achievement:** Complete laundry management system dengan multi-role dashboard

#### **4. Frontend Developer & Data Entry - PT. Spektrum Kreasi Pratama**
* **Period:** November 2023 - February 2024
* **Duration:** 4 months
* **Key Responsibilities:**
  - Mengembangkan dan memelihara fitur frontend untuk inventory sistem laboratorium
  - Mengoptimalkan aplikasi web untuk kecepatan dan skalabilitas maksimum
  - Mengubah sertifikat fisik menjadi file PDF dan input ke Microsoft Excel
* **Tech Stack:** JavaScript, HTML5, CSS3, Microsoft Excel
* **Achievement:** Improved frontend performance significantly, streamlined data entry process

### 📈 Career Highlights:
* **Total Experience:** 1+ years across 4 different positions
* **Project Success Rate:** 100%
* **Client Satisfaction:** 90%
* **Skills Evolution:** From Frontend to Full-stack expertise
* **Industry Exposure:** E-commerce, Laundry Management, Education, Laboratory Systems

### 💻 Core Competencies Developed:
* **Technical Skills:** Full-stack Development, Database Design, API Integration
* **Soft Skills:** Team Leadership, Client Communication, Project Management
* **Performance:** Optimization techniques, Code quality improvement
* **Problem Solving:** Debug complex issues, Implement efficient solutions

### 🎯 Professional Growth:
* **November 2023:** Started as Frontend Developer
* **January 2025:** Evolved to Fullstack Laravel Developer
* **March 2025:** Advanced to Fullstack JavaScript Developer
* **June 2025:** Currently Frontend Developer Intern at established studio

### 📧 Professional Contact:
**Email:** azrlwebdev@gmail.com`;
      }

      if (message.includes("skill") || message.includes("teknologi")) {
        return `## 💻 Tech Stack & Skills - Azriel Rosadi

### 🎨 Frontend Technologies:
* **Core Languages:**
  - HTML5 (Advanced)
  - CSS3 (Advanced)
  - JavaScript ES6+ (Expert)
* **Frameworks & Libraries:**
  - React (Expert)
  - Next.js (Intermediate)
  - TypeScript (Advanced)
* **Styling & UI:**
  - TailwindCSS (Expert)
  - SASS/SCSS (Advanced)
  - PostCSS (Intermediate)
  - Responsive Design (Expert)
* **UI Enhancement:**
  - Lucide React (Advanced)
  - Framer Motion (Intermediate)
  - Interactive Animations (Advanced)

### ⚙️ Backend Technologies:
* **Runtime & Environments:**
  - Node.js (Advanced)
  - PHP (Advanced)
* **Frameworks:**
  - Express.js (Advanced)
  - Laravel 11 (Expert)
* **API Development:**
  - RESTful APIs (Advanced)
  - JSON handling (Expert)
  - Third-party integrations (Advanced)
* **Authentication & Security:**
  - Laravel Sanctum (Advanced)
  - Laravel Breeze (Advanced)
  - JWT tokens (Intermediate)

### 🗄️ Database & Storage:
* **Relational Databases:**
  - MySQL (Advanced)
  - PostgreSQL (Advanced)
* **NoSQL:**
  - MongoDB (Intermediate)
* **ORM & Query Builders:**
  - Drizzle ORM (Advanced)
  - Eloquent ORM (Expert)
  - Raw SQL queries (Advanced)
* **Cloud Storage:**
  - Cloudinary (Intermediate)

### 🎮 Game Development:
* **Game Engine:**
  - Unity 2D/3D (Advanced)
* **Programming:**
  - C# (Advanced)
  - Game Physics (Intermediate)
  - Gameplay Programming (Advanced)
* **3D Modeling:**
  - Blender (Basic)
* **Asset Management:**
  - Unity Asset Store (Advanced)
  - Custom asset creation (Intermediate)

### 🔧 Development Tools & Workflow:
* **Version Control:**
  - Git (Expert)
  - GitHub (Expert)
  - Branch management (Advanced)
* **Deployment & Hosting:**
  - Vercel (Advanced)
  - Netlify (Intermediate)
* **Package Management:**
  - npm (Expert)
  - Composer (Advanced)
* **Development Environment:**
  - VS Code (Expert)
  - Terminal/CLI (Advanced)
* **Project Management:**
  - ClickUp (Advanced)

### 💳 Integration & Services:
* **Payment Systems:**
  - Stripe (Intermediate)
  - Payment gateway integration (Advanced)
* **Authentication Services:**
  - Clerk (Intermediate)
* **Real-time Features:**
  - WebSocket (Intermediate)
  - React Query (Advanced)
* **API Integration:**
  - RESTful services (Advanced)
  - External APIs (Advanced)

### 🐍 Python & Automation:
* **Desktop Applications:**
  - GUI Development (Advanced)
  - Tkinter (Intermediate)
* **Web Scraping:**
  - Automated data extraction (Advanced)
  - BeautifulSoup (Advanced)
  - Selenium (Intermediate)
* **Data Processing:**
  - File handling (Advanced)
  - CSV processing (Advanced)
* **Automation:**
  - Custom scripts (Advanced)
  - Task automation (Advanced)

### ☁️ Additional Technologies:
* **Build Tools:**
  - Vite (Advanced)
  - Webpack (Basic)
* **CSS Preprocessors:**
  - PostCSS (Advanced)
  - Autoprefixer (Advanced)
* **Performance Optimization:**
  - Code splitting (Intermediate)
  - Lazy loading (Advanced)
  - Image optimization (Advanced)
* **SEO & Analytics:**
  - Basic SEO optimization (Intermediate)
  - Meta tags optimization (Advanced)

### 📊 Proficiency Levels:
* **Expert Level:** React, JavaScript, Laravel, HTML/CSS, Git
* **Advanced Level:** Node.js, MySQL, Unity, Python, TailwindCSS
* **Intermediate Level:** TypeScript, MongoDB, PostgreSQL, Next.js
* **Learning/Improving:** Advanced cloud services, DevOps, Testing frameworks

### 🚀 Specialization Areas:
* **Full-stack Web Applications:** E-commerce, Management systems
* **Game Development:** 2D/3D games, Interactive experiences
* **Desktop Applications:** GUI tools, Automation software
* **API Development:** RESTful services, Database integration
* **Performance Optimization:** Code efficiency, Loading speed

### 📧 Technical Discussion:
**Email:** azrlwebdev@gmail.com`;
      }

      if (
        message.includes("kontak") ||
        message.includes("contact") ||
        message.includes("email") ||
        message.includes("hubungi") ||
        message.includes("reach") ||
        message.includes("get in touch")
      ) {
        return `## 📞 Contact Information - Azriel Rosadi

### 📧 Primary Contact:
* **Business Email:** azrlwebdev@gmail.com
* **Portfolio Website:** https://azrl-webdev.vercel.app

### 🌟 Social Media Platforms:
* **LinkedIn:** Professional networking & career updates
* **GitHub:** Code repository & open source projects  
* **Instagram:** @azrlrsdi_ - Behind the scenes & personal updates

### ⚡ Response Time & Availability:
* **Email Response:** < 24 hours (weekdays)
* **Business Hours:** Monday - Friday (09:00 - 17:00 WIB)
* **Weekend:** Limited availability for urgent projects

### 💬 Available Services:
* **Freelance Projects:** Web development, Game development
* **Technical Consultation:** Architecture planning, Code review
* **Collaboration:** Team projects, Partnership opportunities
* **Mentoring:** Code review, Best practices sharing

### 📋 Contact Guidelines:
* **For Project Inquiries:** Include project scope, timeline, budget range
* **For Technical Questions:** Specify technology stack and problem details
* **For Collaboration:** Mention your background and collaboration type
* **For Urgent Matters:** Mark email subject with [URGENT]

### 💡 Tips for Faster Response:
* **Be Specific:** Clear project requirements and expectations
* **Include Details:** Technology preferences, deadline, budget
* **Professional Approach:** Business context and communication style
* **Portfolio Review:** Check existing projects for compatibility

### 📧 Email Template Suggestion:
\`\`\`
Subject: [Project Type] - [Your Company/Name]

Hi Azriel,

I'm interested in discussing [specific service/project].

Project Details:
- Scope: [brief description]
- Timeline: [expected duration]
- Budget: [range if applicable]
- Technology: [preferred stack]

Best regards,
[Your name]
\`\`\``;
      }

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
        return `## 🌟 Social Media Profiles - Azriel Rosadi

### 💼 Professional Platforms:

#### **LinkedIn - Professional Networking**
* **Profile Focus:** Fullstack Developer & Fresh Graduate
* **Content Strategy:**
  - Career updates and milestones
  - Tech industry insights and trends
  - Professional achievements
  - Learning journey documentation
* **Networking Benefits:**
  - Professional connections
  - Collaboration opportunities
  - Industry discussions
  - Career opportunities
* **Engagement:** Weekly posts, Industry discussions, Best practices sharing

#### **GitHub - Code Repository & Open Source**
* **Repository Statistics:**
  - 25+ active public repositories
  - Regular commits and contributions
  - Clean, documented code
  - Live project demos
* **Project Showcase:**
  - Full-stack web applications
  - Game development projects
  - Automation tools
  - Learning experiments
* **Code Quality:**
  - Well-documented projects
  - Best practices implementation
  - Version control expertise
  - Collaborative development

### 📱 Personal Social Media:

#### **Instagram (@azrlrsdi_) - Behind The Scenes**
* **Content Focus:**
  - Development process documentation
  - Workspace setup and coding environment
  - Tech gear reviews and recommendations
  - Personal coding journey insights
* **Story Highlights:**
  - Daily development activities
  - Problem-solving sessions
  - Project progress updates
  - Learning resources sharing
* **Community Engagement:**
  - Developer networking
  - Inspiration sharing
  - Personal branding in tech
  - Fresh graduate experiences

### 🚀 Follow Benefits:
* **Latest Updates:** Real-time project progress and developments
* **Tech Insights:** Practical coding tips and tutorials
* **Learning Resources:** Curated development materials
* **Career Journey:** Fresh graduate to professional developer path
* **Networking:** Connect with developer community
* **Inspiration:** Daily motivation and coding lifestyle

### 📊 Platform Recommendations:
* **For Professional Networking:** LinkedIn - Best for career opportunities
* **For Code Review:** GitHub - Perfect for technical assessment
* **For Personal Insights:** Instagram - Great for behind-the-scenes content
* **For Business Inquiries:** Email - Most reliable for project discussions

### 💡 Engagement Tips:
* **LinkedIn:** Professional discussions, Industry insights, Career networking
* **GitHub:** Code contributions, Project collaborations, Technical reviews
* **Instagram:** Personal connection, Inspiration sharing, Community building

### 📧 Direct Contact:
**For immediate business inquiries:** azrlwebdev@gmail.com`;
      }

      if (message.includes("portfolio") || message.includes("website")) {
        return `## 🌟 Portfolio Overview - Azriel Rosadi

### 🎯 Portfolio Highlights:
* **Total Projects:** 25+ Completed
* **Success Rate:** 100%
* **Client Satisfaction:** 90%
* **On-time Delivery:** 100%

### 💻 Expertise Areas:
* **Full-stack Web Development**
* **Game Development (Unity)**
* **Desktop Applications**
* **API Integration & Development**

### 🚀 Ready for Collaboration:
* **Fresh Graduate** with practical experience
* **Proven Track Record** with satisfied clients
* **Modern Tech Stack** proficiency
* **Professional Communication** and delivery

### 🌐 Complete Portfolio:
**Visit:** https://azrl-webdev.vercel.app

### 📧 Project Discussion:
**Email:** azrlwebdev@gmail.com`;
      }

      if (
        message.includes("harga") ||
        message.includes("price") ||
        message.includes("biaya") ||
        message.includes("cost") ||
        message.includes("layanan") ||
        message.includes("service")
      ) {
        return `## 💰 Services & Pricing - Azriel Rosadi

### 🚀 Available Services:

#### **Web Development**
* **Landing Pages:** Modern, responsive single-page websites
* **Business Websites:** Multi-page with CMS integration
* **Web Applications:** Custom functionality and user dashboards
* **E-commerce Platforms:** Online stores with payment integration

#### **System Development**
* **Management Systems:** Admin panels, inventory systems
* **Dashboard Applications:** Analytics and reporting tools
* **API Development:** RESTful services and integrations
* **Database Design:** Optimized data architecture

#### **Game Development**
* **Unity 2D Games:** Classic arcade-style games
* **Unity 3D Games:** Interactive 3D experiences
* **Web Games:** Browser-based gaming solutions
* **Game Prototypes:** Concept development and testing

#### **Automation & Tools**
* **Desktop Applications:** GUI-based productivity tools
* **Web Scraping:** Automated data extraction
* **Custom Scripts:** Task automation solutions
* **Data Processing:** File handling and conversion

### 💼 Service Packages:

#### **Basic Package**
* **Scope:** Simple landing page or basic web application
* **Features:** Responsive design, Contact forms, Basic SEO
* **Timeline:** 1-2 weeks
* **Ideal For:** Small businesses, Personal portfolios

#### **Business Package**
* **Scope:** Multi-page website with CMS
* **Features:** Admin panel, Content management, Database integration
* **Timeline:** 2-4 weeks
* **Ideal For:** Growing businesses, Service companies

#### **Enterprise Package**
* **Scope:** Complex web application or system
* **Features:** Custom functionality, User management, Advanced features
* **Timeline:** 1-3 months
* **Ideal For:** Large businesses, Custom solutions

#### **Game Development Package**
* **Scope:** Complete game development
* **Features:** Gameplay mechanics, Graphics, Sound integration
* **Timeline:** 2-6 months
* **Ideal For:** Indie developers, Educational games

### ⚡ Service Advantages:
* **Quality Assurance:** 90% client satisfaction rate
* **Timely Delivery:** On-time completion guarantee
* **Post-Launch Support:** Maintenance and updates included
* **Modern Technology:** Latest frameworks and best practices
* **Professional Communication:** Regular updates and transparency

### 📋 Development Process:
1. **Consultation & Analysis:** Requirements gathering and planning
2. **Design & Planning:** Mockups, architecture, and technical specifications
3. **Development & Testing:** Coding, quality assurance, and optimization
4. **Deployment & Training:** Launch setup and client training
5. **Support & Maintenance:** Ongoing assistance and updates

### 💡 Pricing Approach:
* **Project-Based:** Fixed cost for defined scope
* **Hourly Rate:** For ongoing development and maintenance
* **Custom Quotes:** Tailored pricing for unique requirements
* **Flexible Payment:** Milestone-based payment options

### 📞 Get Custom Quote:
* **Include in Your Inquiry:**
  - Project scope and requirements
  - Preferred timeline and deadline
  - Budget range (if available)
  - Technology preferences
  - Specific features needed

### 📧 Request Pricing:
**Email:** azrlwebdev@gmail.com
**Subject:** [Service Type] - Pricing Inquiry
**Include:** Project details, timeline, budget range`;
      }

      if (
        message.includes("testimoni") ||
        message.includes("testimonial") ||
        message.includes("client") ||
        message.includes("review")
      ) {
        return `## ⭐ Client Testimonials - Azriel Rosadi

### 🏪 Liboyy Store (@liboyystore_26)
#### **Project:** Platform Top-up Game & Social Media
* **Service:** Fullstack JavaScript Development
* **Duration:** March 2025 - May 2025
* **Testimonial:**
  *"Saya sangat puas bekerja sama dengan Azriel WebDev, seorang fullstack developer yang memiliki kemampuan teknis luar biasa. Ia berhasil membangun website top up games yang responsif, cepat, dan user-friendly, sekaligus mengintegrasikan layanan sosial media dengan sangat baik!"*

### 🧺 Mbuutt Company (@mbuuttcorp)
#### **Project:** Laundry Management System
* **Service:** Fullstack Laravel Development
* **Duration:** January 2025 - February 2025
* **Testimonial:**
  *"Bekerja sama dalam pengembangan website sistem laundry ini merupakan pengalaman yang sangat profesional. Komitmen terhadap ketepatan waktu, kualitas hasil, serta perhatian terhadap setiap detail proyek sangat terlihat jelas."*

### 🏢 PT. Spektrum Kreasi Pratama (@spektrumkp)
#### **Project:** Laboratory Inventory System
* **Service:** Frontend Development & Data Entry
* **Duration:** November 2023 - February 2024
* **Testimonial:**
  *"Azriel membawa kreativitas dan keahlian ke dalam tim, sehingga meningkatkan kinerja frontend dan entry data kami secara signifikan. Dedikasinya terhadap detail dan kolaborasi yang efektif membuat proyek berjalan lancar dan hasilnya sangat memuaskan."*

### 📊 Client Satisfaction Metrics:
* **Overall Satisfaction Rate:** 90%
* **On-Time Delivery:** 100%
* **Project Success Rate:** 100%
* **Client Retention:** 90%
* **Repeat Business:** 3+ clients with multiple projects

### 🎯 Common Client Feedback Themes:

#### **Technical Excellence:**
* High-quality code implementation
* Modern technology stack usage
* Performance optimization
* Responsive design expertise

#### **Professional Service:**
* Reliable communication and updates
* Commitment to deadlines
* Attention to project details
* Collaborative working approach

#### **Project Management:**
* Clear timeline management
* Regular progress reporting
* Flexible adaptation to requirements
* Post-launch support provision

### 💼 Client Success Stories:

#### **E-commerce Platform Success**
* **Challenge:** Build scalable top-up gaming platform
* **Solution:** React + Node.js + PostgreSQL architecture
* **Result:** Fast, responsive platform with integrated payments
* **Impact:** Successful business launch with satisfied users

#### **Management System Efficiency**
* **Challenge:** Streamline laundry business operations
* **Solution:** Laravel-based management system
* **Result:** Complete admin, owner, and customer dashboards
* **Impact:** Improved operational efficiency and customer satisfaction

#### **Performance Improvement**
* **Challenge:** Optimize laboratory inventory system
* **Solution:** Frontend optimization and data entry automation
* **Result:** Significantly improved system performance
* **Impact:** Enhanced user experience and productivity

### 🤝 What Clients Value Most:
* **Reliability:** Consistent delivery and communication
* **Quality:** High-standard results that exceed expectations
* **Professionalism:** Business-focused approach and accountability
* **Innovation:** Modern solutions with latest technologies
* **Support:** Ongoing assistance and maintenance

### 📈 Ready to Join Satisfied Clients:
* **Proven Track Record:** Multiple successful projects
* **Professional Approach:** Business-focused development
* **Quality Assurance:** High-standard deliverables
* **Ongoing Support:** Post-launch maintenance included

### 📧 Start Your Success Story:
**Email:** azrlwebdev@gmail.com
**Subject:** New Project Inquiry - [Your Business Name]`;
      }

      if (
        message.includes("hire") ||
        message.includes("freelance") ||
        message.includes("kolaborasi") ||
        message.includes("collaboration")
      ) {
        return `## 🤝 Hire Azriel Rosadi - Fullstack Developer

### 💼 Current Availability:
* **Status:** Available for new projects
* **Working Style:** Remote-first, flexible hours
* **Commitment:** Professional, reliable, results-driven
* **Current Position:** Frontend Developer Intern (part-time)

### 🎯 Available Engagement Types:

#### **Full-time Remote Opportunities**
* **Role Types:** Fullstack Developer, Frontend Developer, Backend Developer
* **Commitment:** Long-term career positions
* **Benefits:** Dedicated focus, team integration, consistent availability
* **Ideal For:** Companies seeking permanent team members

#### **Part-time & Contract Work**
* **Flexibility:** 20-30 hours per week
* **Duration:** 3-12 months contracts
* **Benefits:** Cost-effective, specialized expertise, flexible scheduling
* **Ideal For:** Ongoing projects, maintenance, feature additions

#### **Project-based Collaborations**
* **Scope:** Complete project delivery from start to finish
* **Timeline:** 2 weeks to 6 months depending on complexity
* **Benefits:** Fixed scope, predictable costs, dedicated timeline
* **Ideal For:** Specific business needs, product launches

#### **Technical Consulting & Mentoring**
* **Services:** Code review, architecture planning, best practices guidance
* **Format:** Hourly consultations, technical audits
* **Benefits:** Expert insights, problem-solving, knowledge transfer
* **Ideal For:** Technical challenges, team guidance, quality improvement

### 🚀 Core Specializations:

#### **Full-stack Web Development**
* **Frontend:** React, Next.js, TypeScript, TailwindCSS
* **Backend:** Node.js, Express.js, Laravel, PHP
* **Database:** MySQL, PostgreSQL, MongoDB
* **Integration:** APIs, payment systems, third-party services

#### **Game Development**
* **Engine:** Unity 2D/3D
* **Programming:** C#, game physics, interactive gameplay
* **Platforms:** Desktop, web-based games
* **Experience:** Complete game development lifecycle

#### **System Development**
* **Applications:** Management systems, admin dashboards
* **Automation:** Desktop applications, web scraping, data processing
* **Integration:** Database design, API development
* **Optimization:** Performance tuning, scalability planning

### ⚡ Working Style & Values:

#### **Quality Focus**
* **Standards:** High-quality, maintainable code
* **Testing:** Thorough quality assurance and debugging
* **Documentation:** Clear code documentation and project notes
* **Best Practices:** Industry standards and modern methodologies

#### **Reliable Communication**
* **Updates:** Daily progress reports and regular check-ins
* **Transparency:** Clear communication about challenges and solutions
* **Availability:** Responsive to messages and meetings
* **Documentation:** Detailed project documentation and handovers

#### **On-Time Delivery**
* **Planning:** Realistic timeline estimation and milestone tracking
* **Commitment:** Deadline adherence and proactive problem-solving
* **Quality Assurance:** Thorough testing before delivery
* **Support:** Post-delivery assistance and maintenance

### 📈 Professional Track Record:
* **Experience:** 1+ years across 4 different positions
* **Success Rate:** 100% project completion rate
* **Client Satisfaction:** 90% satisfaction rating
* **Portfolio:** 25+ completed projects
* **Skills Growth:** Continuous learning and technology adoption

### 💡 Collaboration Benefits:
* **Fresh Perspective:** Modern approaches and latest technologies
* **Cost-Effective:** Competitive rates with high-quality output
* **Flexibility:** Adaptable to different working styles and requirements
* **Growth Mindset:** Continuous improvement and learning orientation
* **Professional Approach:** Business-focused, results-driven mindset

### 📋 Hiring Process:

#### **Step 1: Initial Consultation**
* **Format:** Email or video call discussion
* **Duration:** 30-60 minutes
* **Content:** Project requirements, technical needs, timeline discussion
* **Outcome:** Mutual fit assessment and preliminary planning

#### **Step 2: Proposal & Planning**
* **Deliverable:** Detailed project proposal with timeline and costs
* **Content:** Technical approach, milestones, deliverables, terms
* **Timeline:** 2-3 business days for proposal delivery
* **Discussion:** Refinement and agreement on project scope

#### **Step 3: Contract & Kickoff**
* **Documentation:** Formal agreement with clear terms
* **Payment:** Milestone-based or agreed payment structure
* **Communication:** Establish regular check-in schedule
* **Project Start:** Official project commencement

#### **Step 4: Development & Delivery**
* **Progress Tracking:** Regular updates and milestone reviews
* **Quality Assurance:** Testing and refinement throughout
* **Client Involvement:** Feedback integration and approval processes
* **Final Delivery:** Complete project handover with documentation

### 🎯 Ideal Collaboration Partners:
* **Startups:** Need technical expertise for MVP development
* **SMEs:** Require web presence or system digitization
* **Agencies:** Seeking reliable development partner
* **Individuals:** Personal projects or business ideas
* **Teams:** Need additional development capacity

### 📧 Start Collaboration:
**Email:** azrlwebdev@gmail.com
**Subject:** Hiring Inquiry - [Position/Project Type]
**Include:** 
- Project or role description
- Timeline and budget expectations
- Team size and working style
- Technical requirements and preferences

### 💬 Let's Build Something Amazing Together!
Ready to bring your ideas to life with professional development expertise and reliable delivery.`;
      }

      return `## 😅 System Maintenance

### 🤖 Currently Available Topics:
* **Projects & Portfolio** (25+ completed projects)
* **Professional Experience** (4 different positions)
* **Tech Stack & Skills** (Full-stack expertise)
* **Contact & Social Media** (Multiple platforms)
* **Services & Pricing** (Custom solutions)
* **Client Testimonials** (90% satisfaction rate)
* **Hiring & Collaboration** (Available for new projects)

### 📧 Direct Contact:
**Email:** azrlwebdev@gmail.com

### ⚡ Try Again:
System will be back online shortly. Feel free to ask about any of the topics above!`;
    }

    // Fallback for general questions with structured format
    return `## 🤖 System Maintenance

### 🔧 Current Status:
Server is temporarily under maintenance. Please try again in a few moments.

### 💬 Available Topics:
* **General Questions:** Technology, programming, development
* **Portfolio Discussion:** Azriel Rosadi (Fullstack Developer)
* **Technical Consultation:** Web development, game development
* **Project Collaboration:** Available services and expertise

### 📧 Alternative Contact:
For urgent inquiries, please email directly: azrlwebdev@gmail.com

### ⚡ Quick Retry:
Try asking your question again in a moment, or explore specific topics about portfolio and services.`;
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
