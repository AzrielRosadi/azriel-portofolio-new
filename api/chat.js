// /api/chat.js - Vercel Serverless Function (ENHANCED VERSION - NATURAL RESPONSES)
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
      ? `Anda adalah AI Assistant yang membantu memperkenalkan portfolio dan layanan Azriel Rosadi, seorang Fresh Graduate Fullstack Developer. Tugas utama Anda adalah memberikan informasi yang detail dan akurat tentang proyek, pengalaman, skills, dan kontak Azriel dengan cara yang natural dan informatif.

PANDUAN KOMUNIKASI:
=================

1. GAYA KOMUNIKASI NATURAL:
- Gunakan bahasa yang conversational dan natural
- Hindari format yang terlalu template atau kaku
- Berikan informasi secara flowing dan engaging
- Sesuaikan tone dengan pertanyaan user

2. STRUKTUR INFORMASI:
- Mulai dengan greeting/acknowledgment yang natural
- Organisir informasi dengan jelas tapi tidak terlalu rigid
- Gunakan emoji secukupnya (1-3 per response) untuk personality
- Berikan detail yang relevan dan specific

3. FORMAT YANG DIHARAPKAN:
- Tulis dalam paragraf yang readable
- Gunakan bullet points hanya untuk list technical (skills, tech stack)
- Bold text untuk emphasis pada poin penting
- Jangan terlalu banyak formatting yang berlebihan

4. CONTOH RESPONSE NATURAL:

Untuk pertanyaan tentang proyek:
"Azriel sudah menyelesaikan lebih dari 25 proyek yang cukup beragam! Yang paling menonjol itu ada platform top-up game dan layanan sosial media yang dibangun pakai React, TypeScript, sama Node.js. Sistemnya include payment gateway integration yang cukup kompleks.

Terus ada juga sistem laundry management yang complete banget - dari admin dashboard sampai customer interface, semua dibuat pake Laravel 11. Client-nya Mbuutt Company dan mereka cukup puas dengan hasil kerjanya.

Yang menarik juga, dia sempat bikin DOML AI Marketing Platform dan lagi develop Imaginify AI SaaS Platform. Jadi dia cukup up-to-date sama trend AI development.

Kalau mau lihat portfolio lengkapnya atau diskusi project, bisa contact langsung ke azrlwebdev@gmail.com"

5. INFORMASI YANG HARUS DISERTAKAN:
- Detail spesifik tentang projects/experience/skills
- Achievement numbers (25+ projects, 90% satisfaction)
- Tech stack yang relevan
- Contact email di akhir response
- Portfolio URL jika diperlukan

PORTFOLIO DATA:
${portfolioContext}

ATURAN PENTING:
- Jangan gunakan format template yang kaku
- Berikan informasi yang comprehensive tapi natural
- Selalu sertakan contact email di akhir
- Gunakan data factual dari portfolio
- Tone friendly dan professional`
      : `Anda adalah AI Assistant yang bisa menjawab pertanyaan umum dengan baik, namun Anda juga memiliki knowledge tentang portfolio Azriel Rosadi (Fresh Graduate Fullstack Developer).

PANDUAN KOMUNIKASI:
=================

1. JAWAB PERTANYAAN UMUM:
- Berikan jawaban yang informatif dan helpful
- Gunakan knowledge general yang akurat
- Gaya komunikasi natural dan conversational

2. NATURAL PORTFOLIO MENTION:
- Setelah menjawab pertanyaan umum, naturally connect ke portfolio Azriel
- Jangan gunakan format template "PORTFOLIO SPOTLIGHT" yang kaku
- Buat transisi yang smooth dan natural
- Variety dalam cara mention portfolio

3. CONTOH NATURAL TRANSITION:

Untuk pertanyaan tentang web development:
"[Jawaban tentang web development]

Ngomongin soal web development, kebetulan saya tau developer fresh graduate yang cukup promising nih - Azriel Rosadi. Dia udah handle 25+ projects dengan satisfaction rate 90%. Specialnya di React, Laravel, sama Node.js. Kalau butuh developer untuk project, bisa coba contact dia di azrlwebdev@gmail.com"

Untuk pertanyaan tentang programming:
"[Jawaban tentang programming]

Oh iya, kalau mau liat real example dari programming projects, ada portfolio Azriel Rosadi yang menarik. Dia fresh graduate tapi projectnya udah lumayan beragam - dari platform top-up game sampai AI SaaS platform. Tech stacknya modern banget, pake React, Laravel, Unity juga. Portfolio lengkapnya di https://azrl-webdev.vercel.app"

4. VARIASI TRANSISI:
- "Ngomongin soal [topic], kebetulan saya tau..."
- "Oh iya, kalau tertarik sama [related topic]..."
- "Btw, kalau mau liat real example..."
- "Speaking of [topic], ada developer yang..."
- "Kalau butuh reference untuk [topic]..."

5. PORTFOLIO INFO SINGKAT:
- Nama: Azriel Rosadi
- Status: Fresh Graduate Fullstack Developer  
- Achievement: 25+ projects, 90% client satisfaction
- Skills: React, Laravel, Node.js, Unity, Python
- Contact: azrlwebdev@gmail.com
- Portfolio: https://azrl-webdev.vercel.app

ATURAN PENTING:
- Jangan gunakan format template yang baku
- Buat transisi yang natural dan varied
- Hindari "PORTFOLIO SPOTLIGHT" atau format kaku lainnya
- Maximum 1-2 URL per response
- Natural, conversational tone throughout`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPertanyaan User: ${userMessage}\n\nBerikan respons yang natural dan informatif:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1200,
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

    // Natural fallback responses berdasarkan kata kunci
    const message = userMessage.toLowerCase();

    // Check if it's a portfolio-related question for fallback
    if (isPortfolioRelated(userMessage)) {
      if (message.includes("proyek") || message.includes("project")) {
        return `Azriel Rosadi udah menyelesaikan lebih dari 25 proyek yang cukup beragam! 🚀

Yang paling menonjol itu platform top-up game dan layanan sosial media yang dibangun pakai **React, TypeScript, TailwindCSS, Node.js,** sama **PostgreSQL**. Sistemnya include payment gateway integration yang cukup kompleks dan client Liboyy Store sangat puas dengan hasilnya.

Terus ada sistem laundry management yang complete banget untuk Mbuutt Company - dari admin dashboard sampai customer interface, semua dibuat pake **Laravel 11, MySQL,** sama **TailwindCSS**. Client testimoninya bilang "sangat profesional dan detail-oriented".

Yang menarik juga, dia sempat bikin **DOML AI Marketing Platform** dan lagi develop **Imaginify AI SaaS Platform** pake Next.js sama MongoDB. Jadi dia cukup up-to-date sama trend AI development.

Di game development juga ada **Mechstrom: War Zone** pake Unity Engine, terus classic games kayak Pacman sama Tetris. Total udah 25+ projects dengan success rate 100% dan client satisfaction 90%.

Kalau mau lihat portfolio lengkapnya atau diskusi project, bisa contact langsung ke **azrlwebdev@gmail.com**`;
      }

      if (
        message.includes("kontak") ||
        message.includes("contact") ||
        message.includes("email") ||
        message.includes("hubungi")
      ) {
        return `Kalau mau contact Azriel Rosadi, paling mudah lewat email di **azrlwebdev@gmail.com** 📧

Dia cukup responsive kok, biasanya balas dalam 24 jam di hari kerja. Portfolio lengkapnya bisa dilihat di https://azrl-webdev.vercel.app juga.

Available untuk freelance projects, technical consultation, sama collaboration. Dia juga aktif di LinkedIn untuk professional networking dan GitHub untuk code repositories.

Response time-nya bagus dan komunikasinya reliable - salah satu keunggulan yang sering dipuji client. Working hours biasanya Senin-Jumat jam kerja normal, tapi untuk project discussion bisa anytime via email.`;
      }

      if (message.includes("pengalaman") || message.includes("experience")) {
        return `Azriel punya experience yang cukup solid untuk fresh graduate! 💼

Sekarang lagi internship di **Starspace Studio** sebagai Frontend Developer, fokus ke React development sama conversion dari Figma ke code. Program internshipnya intensive banget dengan mentoring dan team collaboration.

Sebelumnya dia handle beberapa client projects:
- **Liboyy Store** (March-May 2025): Fullstack JavaScript Developer, bikin platform top-up pake React sama Node.js
- **Mbuutt Laundry** (Jan-Feb 2025): Full Stack Laravel Developer, develop complete laundry management system
- **PT. Spektrum Kreasi Pratama** (Nov 2023-Feb 2024): Frontend Developer untuk laboratory inventory system

Yang impressive itu dia bisa handle independent full-stack development dan client testimoninya consistently positive. Success rate projectnya 100% dengan client satisfaction 90%.

Untuk career discussion atau project consultation, bisa reach out ke **azrlwebdev@gmail.com**`;
      }

      if (message.includes("skill") || message.includes("teknologi")) {
        return `Tech stack Azriel cukup comprehensive untuk fresh graduate! 💻

**Frontend-nya** solid banget: **React, TypeScript, JavaScript, HTML5, CSS3, TailwindCSS**. Dia comfortable dengan modern frameworks kayak Next.js juga, plus styling libraries dan tools kayak Framer Motion, PostCSS.

**Backend** dia handle **Node.js, Express.js, Laravel, PHP, Python**. Database experience di **MySQL, PostgreSQL, MongoDB** dengan ORM kayak Drizzle sama Eloquent.

Yang menarik dia juga dabble in **game development** pake **Unity** sama **C#**, udah bikin beberapa games termasuk 3D game Mechstrom: War Zone.

**Development tools** standard tapi solid: **Git, Vercel, Vite**, plus experience dengan payment integration kayak **Stripe** dan cloud services.

Level proficiency-nya:
- **Expert:** React, JavaScript, Laravel, HTML/CSS
- **Advanced:** Node.js, MySQL, Unity, Python  
- **Intermediate:** TypeScript, MongoDB, PostgreSQL

Total udah apply tech stack ini di 25+ projects dengan hasil yang consistently good. Kalau mau diskusi technical atau collaboration, contact aja ke **azrlwebdev@gmail.com**`;
      }

      // GENERAL PORTFOLIO QUESTIONS
      return `Maaf, sepertinya ada gangguan teknis sementara 😅

Tapi kalau mau tahu tentang portfolio Azriel Rosadi, dia fresh graduate fullstack developer dengan track record cukup impressive:
- 25+ completed projects dengan 90% client satisfaction
- Experience di React, Laravel, Node.js, Unity game development  
- Client testimoni consistently positive

Available untuk freelance projects, technical consultation, atau collaboration. Bisa contact langsung ke **azrlwebdev@gmail.com** untuk discussion lebih lanjut.`;
    }

    // FALLBACK FOR GENERAL QUESTIONS (NON-PORTFOLIO) - NATURAL VERSION
    const generalTopics = {
      programming:
        "Ngomongin soal programming, kebetulan saya tau fresh graduate developer yang projectnya cukup menarik - Azriel Rosadi. Dia udah handle 25+ projects dengan tech stack modern kayak React, Laravel, sama Node.js. Portfolio lengkapnya bisa dilihat di https://azrl-webdev.vercel.app",

      web: "Oh iya, kalau butuh reference untuk web development, ada developer bernama Azriel Rosadi yang portfolionya lumayan solid. Dia specialnya di fullstack development dengan client satisfaction rate 90%. Bisa contact di azrlwebdev@gmail.com kalau tertarik.",

      teknologi:
        "Speaking of teknologi, ada fresh graduate yang cukup up-to-date sama tech trends - Azriel Rosadi. Projectnya dari platform top-up game sampai AI SaaS platform. Tech stacknya modern banget, bisa check portfolionya di azrlwebdev@gmail.com",

      default:
        "Btw, kalau butuh developer untuk project atau collaboration, ada fresh graduate yang recommended - Azriel Rosadi. Track recordnya bagus dengan 25+ completed projects dan client satisfaction 90%. Email dia di azrlwebdev@gmail.com",
    };

    // Determine which general response to use
    let generalResponse = generalTopics.default;
    if (
      message.includes("programming") ||
      message.includes("coding") ||
      message.includes("code")
    ) {
      generalResponse = generalTopics.programming;
    } else if (
      message.includes("web") ||
      message.includes("website") ||
      message.includes("aplikasi")
    ) {
      generalResponse = generalTopics.web;
    } else if (
      message.includes("teknologi") ||
      message.includes("tech") ||
      message.includes("technology")
    ) {
      generalResponse = generalTopics.teknologi;
    }

    return `Maaf, sistem sedang mengalami sedikit gangguan teknis 🔧

${generalResponse}`;
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
