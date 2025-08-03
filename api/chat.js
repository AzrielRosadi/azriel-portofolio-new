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
      name:
        $('h1, .hero-title, [class*="name"]').first().text()?.trim() ||
        staticPortfolioData.name,
      title:
        $('h2, .hero-subtitle, [class*="title"]').first().text()?.trim() ||
        staticPortfolioData.title,
      scrapedBio: $('p, .bio, .about, [class*="description"]')
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((text) => text.length > 50)
        .slice(0, 2),
      scrapedSkills: $('[class*="skill"], [class*="tech"], .technology, .stack')
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((skill) => skill.length > 0 && skill.length < 50),
      lastUpdated: new Date().toISOString(),
      url: "https://azrl-webdev.vercel.app",
      dataSource: "scraped",
    };

    console.log("✅ Portfolio data scraped successfully");
    return scrapedData;
  } catch (error) {
    console.error("❌ Error scraping portfolio:", error.message);
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
  const urlPattern = /(https?:\/\/[^\s\[\]()]+)/g;
  let cleanedText = text;
  const foundUrls = text.match(urlPattern) || [];

  if (foundUrls.length > 1) {
    for (let i = 1; i < foundUrls.length; i++) {
      const duplicateUrl = foundUrls[i];
      cleanedText = cleanedText.replace(
        new RegExp(duplicateUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        ""
      );
    }
    cleanedText = cleanedText
      .replace(/\(\s*\)/g, "")
      .replace(/\[\s*\]/g, "")
      .replace(/\s+/g, " ")
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

    const isPortfolioQuestion = isPortfolioRelated(userMessage);

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

ATURAN PENTING UNTUK FORMAT RESPONSE:
- WAJIB: Gunakan bullet points (• atau -) untuk informasi yang bersifat list, detail teknis, atau enumeration
- WAJIB: Gunakan heading (** **) untuk judul section
- WAJIB: Gunakan struktur yang rapi dan mudah dibaca
- WAJIB: Untuk pertanyaan tentang proyek, experience, skills, atau media sosial SELALU gunakan bullet points

ATURAN PENTING UNTUK LINK/URL:
- WAJIB: Hanya sertakan MAKSIMAL 1 (SATU) link/URL per respons
- Pilih link yang PALING RELEVAN dengan pertanyaan user
- JANGAN PERNAH menampilkan link yang sama berulang kali
- HINDARI duplikasi URL dalam format apapun

DATA PORTFOLIO TERKINI:
${portfolioContext}

CONTOH FORMAT YANG BENAR:
✅ BENAR untuk pertanyaan tentang proyek:
**🚀 Proyek Unggulan Azriel:**

**• Platform Top-up Game (2025)**
  - Tech Stack: React, TypeScript, Node.js, PostgreSQL
  - Fitur: Sistem pembayaran terintegrasi
  - Status: Successfully deployed

**• System Laundry (2025)**
  - Tech Stack: Laravel 11, MySQL, TailwindCSS
  - Fitur: Admin dashboard, Customer interface
  - Status: Complete solution

CONTOH FORMAT YANG BENAR untuk pertanyaan tentang skills:
**💻 Tech Stack Azriel:**

**• Frontend Technologies:**
  - React, TypeScript, JavaScript
  - TailwindCSS, HTML5, CSS3
  - Next.js, Vite

**• Backend Technologies:**
  - Node.js, Express.js
  - Laravel, PHP
  - Python

PANDUAN RESPONS:
- Untuk pertanyaan tentang proyek: Jelaskan dengan bullet points, detail teknis, tech stack, tahun pembuatan, dan hasil
- Untuk pertanyaan tentang pengalaman: Gunakan bullet points untuk tanggal, achievement, dan kontribusi spesifik
- Untuk pertanyaan tentang skills: Kategorikan dengan bullet points berdasarkan jenis teknologi
- Untuk pertanyaan kontak/kolaborasi: Berikan HANYA satu kontak yang paling relevan (email ATAU portfolio website)
- Untuk pertanyaan pricing/layanan: Arahkan untuk diskusi detail via email
- PRIORITASKAN kualitas informasi daripada kuantitas link

PENTING: 
- Gunakan informasi yang akurat sesuai data portfolio
- Sebutkan tanggal/periode yang spesifik untuk pengalaman kerja
- Jelaskan tech stack yang digunakan untuk setiap proyek dengan bullet points
- PRIORITASKAN: Satu link berkualitas > Multiple link duplikat
- SELALU gunakan bullet points untuk detail teknis, list, dan informasi terstruktur

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
                text: `${systemPrompt}\n\nPertanyaan User: ${userMessage}\n\nBerikan respons yang informatif dan engaging dengan format yang rapi menggunakan bullet points jika diperlukan (INGAT: maksimal 1 URL per respons):`,
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

    const cleanedResponse = cleanDuplicateUrls(aiResponse.trim());
    return cleanedResponse;
  } catch (error) {
    console.error("❌ Error generating Gemini response:", error.message);

    const message = userMessage.toLowerCase();

    if (isPortfolioRelated(userMessage)) {
      if (message.includes("proyek") || message.includes("project")) {
        return `🚀 **Proyek Unggulan Azriel - 25+ Projects Completed**

**• Platform Top-up Game & Social Media (2025)**
  - Tech Stack: React, TypeScript, TailwindCSS, Node.js, Express.js, PostgreSQL
  - Fitur: Sistem pembayaran terintegrasi, Multi-platform support
  - Status: Successfully deployed & maintained
  - Client: Liboyy Store

**• System Laundry Website (2025)**
  - Tech Stack: Laravel 11, MySQL, TailwindCSS, Blade Template, Laravel Sanctum
  - Fitur: Admin dashboard, Owner panel, Customer interface
  - Status: Complete full-stack solution
  - Client: Mbuutt Company

**• DOML AI Marketing Platform (2025)**
  - Tech Stack: React, TailwindCSS, Lucide React, PostCSS
  - Fitur: AI-powered marketing optimization, Modern UI/UX
  - Status: Prototype completed

**• Imaginify AI SaaS Platform (2025)**
  - Tech Stack: Next.js, MongoDB, Stripe, Cloudinary, Clerk
  - Fitur: AI features, Credit-based payment system
  - Status: In active development

**• Mechstrom: War Zone Game (2024)**
  - Tech Stack: Unity Engine, C#, Blender
  - Fitur: 3D gameplay mechanics, Physics-based combat
  - Status: Completed game prototype

**📊 Project Statistics:**
• Total Projects: 25+
• Success Rate: 100%
• Client Satisfaction: 90%
• On-time Delivery: 100%

**💬 Tertarik diskusi proyek?**
📧 Email: azrlwebdev@gmail.com`;
      }

      if (message.includes("pengalaman") || message.includes("experience")) {
        return `💼 **Pengalaman Kerja Azriel Rosadi**

**• Frontend Developer Intern - Starspace Studio**
  - Period: June 2025 - Present (Current Position)
  - Responsibilities: Mengembangkan antarmuka web interaktif berdasarkan desain Figma
  - Team Work: Kolaborasi dalam tim lintas bidang, weekly meeting & mentoring
  - Tools: ClickUp untuk project tracking, React development
  - Achievement: Successfully integrated into professional development team

**• Fullstack JavaScript Developer - Liboyy Store**
  - Period: March 2025 - May 2025 (3 months)
  - Tech Stack: React, Node.js, PostgreSQL, Express.js
  - Responsibilities: Membangun aplikasi web responsif dan backend integration
  - Achievement: Platform top-up game berhasil deployed dengan performa optimal

**• Fullstack Laravel Developer - Mbuutt Laundry**
  - Period: January 2025 - February 2025 (2 months)
  - Tech Stack: Laravel 11, MySQL, TailwindCSS, Blade Template
  - Responsibilities: Memimpin pengembangan platform secara mandiri
  - Achievement: Complete laundry management system dengan multi-role dashboard

**• Frontend Developer - PT. Spektrum Kreasi Pratama**
  - Period: November 2023 - February 2024 (4 months)
  - Tech Stack: JavaScript, HTML5, CSS3, Microsoft Excel
  - Responsibilities: Frontend development untuk inventory sistem laboratorium
  - Achievement: Improved application performance dan data processing efficiency

**📈 Career Highlights:**
• Total Experience: 1+ years across 4 positions
• Success Rate: 100% project completion
• Client Satisfaction: 90% retention rate
• Growth: From Frontend to Full-stack expertise

**💬 Ready for collaboration?**
📧 Email: azrlwebdev@gmail.com`;
      }

      if (message.includes("skill") || message.includes("teknologi")) {
        return `💻 **Tech Stack & Skills Azriel Rosadi**

**• Frontend Technologies**
  - Core: HTML5, CSS3, JavaScript (ES6+)
  - Frameworks: React, Next.js, TypeScript
  - Styling: TailwindCSS, SASS, PostCSS
  - UI Libraries: Lucide React, Framer Motion

**• Backend Technologies**
  - Runtime: Node.js, Express.js
  - Frameworks: Laravel 11, PHP
  - Languages: Python, JavaScript
  - API: RESTful APIs, Authentication systems

**• Database & Storage**
  - Relational: MySQL, PostgreSQL
  - NoSQL: MongoDB
  - ORM: Drizzle ORM, Eloquent ORM
  - Cloud: Cloudinary integration

**• Development Tools**
  - Version Control: Git, GitHub
  - Deployment: Vercel, Netlify
  - Package Managers: npm, Composer
  - Project Management: ClickUp

**• Specialized Skills**
  - Game Development: Unity, C#, Blender basics
  - Payment Integration: Stripe
  - Automation: Python scripting, Web scraping
  - Performance: Code optimization, Responsive design

**📊 Proficiency Levels:**
• Expert: React, JavaScript, Laravel, HTML/CSS
• Advanced: Node.js, MySQL, Unity, Python
• Intermediate: TypeScript, MongoDB, PostgreSQL

**💬 Need technical consultation?**
📧 Email: azrlwebdev@gmail.com`;
      }

      if (
        message.includes("sosial") ||
        message.includes("social") ||
        message.includes("media") ||
        message.includes("instagram") ||
        message.includes("linkedin") ||
        message.includes("github")
      ) {
        return `🌟 **Media Sosial Azriel Rosadi:**

**• LinkedIn - Professional Networking**
  - Profile: Fullstack Developer & Fresh Graduate
  - Content: Career updates, tech industry insights, achievements
  - Networking: Professional connections, collaboration opportunities
  - Updates: Weekly posts about projects and learning journey
  - Engagement: Industry discussions, best practices sharing

**• GitHub - Code Repository & Open Source**
  - Repositories: 25+ active public repositories
  - Code Quality: Clean, documented, maintainable code
  - Projects: Full-stack applications, games, tools, experiments
  - Contributions: Regular commits and updates
  - Showcase: Live demos and project documentation
  - Tech Stack: React, Laravel, Unity, Python projects

**• Instagram (@azrlrsdi_) - Behind The Scenes**
  - Content Focus: Development process, workspace setup, coding lifestyle
  - Stories: Daily development activities, problem-solving sessions
  - Posts: Tech gear reviews, setup tours, project highlights
  - Community: Developer networking, inspiration sharing
  - Personal Touch: Coding journey as fresh graduate

**🚀 Follow untuk mendapatkan:**
• Latest Project Updates: Real-time development progress
• Tech Tips & Tutorials: Practical coding insights
• Development Insights: Problem-solving approaches
• Career Journey: Fresh graduate to professional developer
• Collaboration Opportunities: Project partnerships
• Community Engagement: Developer networking events

**📊 Social Media Stats:**
• GitHub: 25+ repositories, active contributions
• LinkedIn: Professional network, industry engagement
• Instagram: Behind-the-scenes content, personal branding

**💬 Platform Recommendations:**
• For Professional Networking: Connect on LinkedIn
• For Code & Projects: Follow on GitHub
• For Personal Insights: Follow on Instagram
• For Business Inquiries: Email azrlwebdev@gmail.com

**💡 Pro Tips:**
• LinkedIn: Best for professional discussions and opportunities
• GitHub: Perfect for viewing code quality and project scope
• Instagram: Great for seeing the person behind the code

📧 **Business contact:** azrlwebdev@gmail.com`;
      }

      if (
        message.includes("kontak") ||
        message.includes("contact") ||
        message.includes("email") ||
        message.includes("hubungi")
      ) {
        return `📞 **Kontak & Media Sosial Azriel Rosadi:**

**📧 KONTAK UTAMA:**
• Email Bisnis: azrlwebdev@gmail.com
• Portfolio Website: https://azrl-webdev.vercel.app

**🌟 MEDIA SOSIAL:**
• LinkedIn: Professional networking & career updates
• GitHub: Code repository & open source projects  
• Instagram: @azrlrsdi_ - Behind the scenes & personal updates

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

      return `😅 **Server sedang maintenance.** Coba lagi sebentar!

**🤖 Sementara itu, Anda bisa bertanya tentang:**
• Proyek & Portfolio (25+ completed)
• Pengalaman Kerja (4 posisi berbeda)
• Tech Stack & Skills 
• Kontak & Media Sosial
• Layanan & Pricing
• Testimoni Client

📧 **Email langsung:** azrlwebdev@gmail.com`;
    }

    return `🤖 **Maaf, server sedang maintenance!**

**Saya bisa membantu Anda dengan berbagai pertanyaan, termasuk:**
• Pertanyaan umum dan diskusi
• Teknologi dan programming
• Portfolio Azriel Rosadi (Fullstack Developer)

⚡ Coba lagi dalam beberapa saat atau ajukan pertanyaan lain!`;
  }
}

// Main API handler
export default async function handler(req, res) {
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

    const portfolioData = isPortfolioRelated(message)
      ? await getPortfolioData()
      : null;
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
