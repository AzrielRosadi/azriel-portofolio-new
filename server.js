import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced Function untuk membersihkan dan memformat response dari Gemini
const cleanAndFormatResponse = (rawResponse) => {
  if (!rawResponse || typeof rawResponse !== "string") {
    return rawResponse;
  }

  let cleanedResponse = rawResponse;

  // 1. Clean up multiple line breaks dan normalize spacing
  cleanedResponse = cleanedResponse.replace(/\n{3,}/g, "\n\n");
  cleanedResponse = cleanedResponse.replace(/\s{3,}/g, " ");

  // 2. Remove markdown-style formatting that might interfere
  cleanedResponse = cleanedResponse.replace(/^#{1,6}\s+/gm, "");

  // 3. Convert **text** to <strong>text</strong> for bold
  cleanedResponse = cleanedResponse.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // 4. Convert *text* to <em>text</em> for italic (not already bold)
  cleanedResponse = cleanedResponse.replace(
    /(?<!\*)\*([^*\n]+?)\*(?!\*)/g,
    "<em>$1</em>"
  );

  // 5. Format section headers with emojis
  cleanedResponse = cleanedResponse.replace(
    /([\u{1F300}-\u{1F9FF}]|\u{2600}-\u{26FF}|\u{2700}-\u{27BF})\s*([A-Z][A-Z\s&:-]+)/gu,
    '<div class="section-header">$1 <strong>$2</strong></div>'
  );

  // 6. Format bullet points with emojis
  cleanedResponse = cleanedResponse.replace(
    /^(\s*)(🔸|✨|⭐|🚀|💼|📱|🌟|🎨|⚙️|🔧|📋|⏰|🎯|✅|💬|💰|•|-)\s*(.+)$/gm,
    '<div class="bullet-point">$2 $3</div>'
  );

  // 7. Format numbered lists
  cleanedResponse = cleanedResponse.replace(
    /^(\s*)(\d+\.)\s*(.+)$/gm,
    '<div class="numbered-item"><span class="number">$2</span> $3</div>'
  );

  // 8. Convert email addresses to clickable links
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  cleanedResponse = cleanedResponse.replace(
    emailPattern,
    '<a href="mailto:$1" class="contact-link">$1</a>'
  );

  // 9. Convert URLs to clickable links
  const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
  cleanedResponse = cleanedResponse.replace(
    urlPattern,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="website-link">$1</a>'
  );

  // 10. Remove "mailto:" text that appears directly in response
  cleanedResponse = cleanedResponse.replace(
    /(?<!href=")mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    "$1"
  );

  // 11. Format price ranges and single prices
  cleanedResponse = cleanedResponse.replace(
    /\$(\d+)[-–](\d+)/g,
    '<span class="price-range">$$$1-$$$2</span>'
  );
  cleanedResponse = cleanedResponse.replace(
    /\$(\d+)\+?/g,
    '<span class="price">$$$1+</span>'
  );

  // 12. Convert line breaks to proper HTML with better spacing
  cleanedResponse = cleanedResponse.replace(
    /\n\n/g,
    '</div><div class="paragraph">'
  );
  cleanedResponse = cleanedResponse.replace(/\n/g, "<br>");

  // 13. Wrap content properly
  if (!cleanedResponse.includes('<div class="paragraph">')) {
    cleanedResponse = '<div class="paragraph">' + cleanedResponse + "</div>";
  }

  // 14. Add comprehensive styling
  const styledResponse = `
<div class="ai-response-container">
  <style>
    .ai-response-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #2d3748;
      max-width: 100%;
      background: #ffffff;
    }
    
    .paragraph {
      margin: 0 0 1.2em 0;
      padding: 0;
    }
    
    .section-header {
      margin: 1.8em 0 1em 0;
      padding: 0.8em 1em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      font-size: 1.1em;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .bullet-point {
      margin: 0.6em 0;
      padding: 0.5em 0.8em;
      padding-left: 2.5em;
      position: relative;
      background: #f7fafc;
      border-left: 3px solid #4299e1;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .bullet-point:hover {
      background: #edf2f7;
      transform: translateX(2px);
    }
    
    .bullet-point::before {
      content: attr(data-emoji);
      position: absolute;
      left: 0.8em;
      top: 0.5em;
      font-size: 1.1em;
    }
    
    .numbered-item {
      margin: 0.6em 0;
      padding: 0.5em 0.8em;
      padding-left: 3em;
      position: relative;
      background: #f0fff4;
      border-left: 3px solid #48bb78;
      border-radius: 4px;
    }
    
    .number {
      position: absolute;
      left: 0.8em;
      top: 0.5em;
      font-weight: bold;
      color: #48bb78;
      font-size: 1.1em;
    }
    
    .contact-link {
      color: #3182ce;
      text-decoration: none;
      padding: 3px 8px;
      border-radius: 6px;
      background: linear-gradient(135deg, #e6f3ff 0%, #cce7ff 100%);
      border: 1px solid #90cdf4;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .contact-link:hover {
      background: linear-gradient(135deg, #cce7ff 0%, #99d8ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(49, 130, 206, 0.2);
    }
    
    .website-link {
      color: #805ad5;
      text-decoration: none;
      padding: 3px 8px;
      border-radius: 6px;
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border: 1px solid #d6d3d1;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .website-link:hover {
      background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(128, 90, 213, 0.2);
    }
    
    .price, .price-range {
      background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
      color: #22543d;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      border: 1px solid #9ae6b4;
      font-size: 0.95em;
    }
    
    .ai-response-container strong {
      color: #1a202c;
      font-weight: 600;
    }
    
    .ai-response-container em {
      color: #4a5568;
      font-style: italic;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .ai-response-container {
        font-size: 0.9em;
      }
      
      .section-header {
        margin: 1.5em 0 0.8em 0;
        padding: 0.6em 0.8em;
        font-size: 1em;
      }
      
      .bullet-point, .numbered-item {
        padding: 0.4em 0.6em;
        margin: 0.4em 0;
      }
    }
    
    /* Animation for smooth loading */
    .ai-response-container {
      animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
  
  <div class="response-content">
    ${cleanedResponse}
  </div>
</div>`;

  return styledResponse.trim();
};

// Enhanced Knowledge Base tentang Azriel Portfolio
const azrielKnowledgeBase = {
  personal: {
    name: "Azriel Rosadi",
    title: "Web Developer & 3D Enthusiast",
    website: "https://azrl-webdev.vercel.app/",
    email: "azrlwebdev@gmail.com",
    phone: "Available on request",
    location: "Indonesia",
    status: "Fresh Graduate - Front-End Developer Intern at Starspace Studio",
    availability: "Available for freelance projects and collaborations",
    expertise: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Three.js",
      "JavaScript",
      "Laravel",
      "Node.js",
      "PostgreSQL",
      "Frontend Development",
      "Fullstack Development",
      "3D Web Development",
      "Interactive UI/UX",
    ],
    specializations: [
      "Interactive 3D Web Experiences",
      "Modern Web Applications",
      "Responsive Design",
      "Performance Optimization",
      "Creative UI/UX Implementation",
    ],
  },

  stats: {
    experience: "Fresh Graduate with Professional Experience",
    clients: "5+",
    completedProjects: "25+",
    clientRetentionRate: "95%",
    technologies: "15+",
    yearsActive: "2+",
  },

  technologies: {
    frontend: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Vue.js",
    ],
    backend: ["Node.js", "Laravel", "PHP", "Express.js"],
    database: ["PostgreSQL", "MySQL", "MongoDB"],
    styling: [
      "Tailwind CSS",
      "SCSS",
      "Styled Components",
      "Framer Motion",
      "Bootstrap",
    ],
    animation: [
      "GSAP",
      "Framer Motion",
      "CSS Animations",
      "Three.js",
      "Lottie",
    ],
    threedGraphics: [
      "Three.js",
      "@react-three/fiber",
      "@react-three/drei",
      "WebGL",
      "Blender",
    ],
    tools: [
      "Vite",
      "Git",
      "GitHub",
      "Figma",
      "VS Code",
      "ClickUp",
      "Photoshop",
    ],
    deployment: ["Vercel", "Netlify", "GitHub Pages", "Railway", "Heroku"],
    other: ["RESTful APIs", "GraphQL", "Socket.io", "PWA", "SEO Optimization"],
  },

  workExperience: [
    {
      company: "Starspace Studio",
      position: "Front-End Developer Intern",
      period: "June 2025 - Present",
      status: "Current Position",
      type: "Full-time Internship",
      description:
        "Program internship intensif dengan fokus pengembangan teknis dan budaya kerja kolaboratif dalam environment startup teknologi",
      responsibilities: [
        "Mengembangkan antarmuka web interaktif dan responsif dari desain Figma",
        "Terlibat dalam proyek nyata dengan tim lintas bidang (UI/UX, Backend, DevOps)",
        "Update progres harian menggunakan ClickUp dan weekly meeting dengan stakeholder",
        "Mentoring dengan profesional industri dan reverse mentorship program",
        "Dokumentasi pembelajaran melalui #WeeklyWins dan knowledge sharing",
        "Code review dan best practices implementation",
        "Performance optimization dan testing implementation",
      ],
      achievements: [
        "Berhasil meningkatkan performance aplikasi hingga 40%",
        "Implementasi responsive design yang compatible di semua device",
        "Kontribusi aktif dalam team collaboration dan agile methodology",
      ],
    },
    {
      company: "Liboyy Store",
      position: "Fullstack JavaScript Developer",
      period: "March 2025 - May 2025",
      type: "Freelance Project",
      description:
        "Membangun platform e-commerce top-up games dengan complete fullstack solution menggunakan modern JavaScript technologies",
      responsibilities: [
        "Membangun aplikasi web responsif dengan React.js dan backend Node.js",
        "Integrasi dengan database PostgreSQL untuk user management dan transactions",
        "Implementasi payment gateway dan API integration",
        "Optimasi performa aplikasi dan pengalaman pengguna",
        "Security implementation dan data validation",
        "Deployment dan maintenance setup",
      ],
      achievements: [
        "Berhasil launching website dengan 0 downtime",
        "Implementasi secure payment system",
        "User-friendly interface dengan conversion rate tinggi",
      ],
    },
    {
      company: "Mbuutt Laundry",
      position: "Full Stack Laravel Developer",
      period: "Jan 2025 - Feb 2025",
      type: "Custom Development Project",
      description:
        "Membangun sistem management laundry lengkap sebagai solo fullstack developer dengan complete CRUD operations",
      responsibilities: [
        "Memimpin pengembangan platform web Mbuutt Laundry dari scratch",
        "Membangun seluruh fitur frontend dan backend secara mandiri",
        "Database design dan optimization untuk laundry operations",
        "User authentication dan authorization system",
        "Reporting dan analytics dashboard",
        "Mobile-responsive design implementation",
      ],
      achievements: [
        "Delivery tepat waktu sesuai deadline",
        "System yang user-friendly untuk non-technical users",
        "Automated workflow yang meningkatkan efficiency operational",
      ],
    },
    {
      company: "PT. Spektrum Kreasi Pratama",
      position: "Frontend Developer & Data Entry Specialist",
      period: "November 2023 - Februari 2024",
      type: "Contract Position",
      description:
        "Pengembangan frontend dan pengelolaan data untuk sistem inventory laboratorium dengan focus pada user experience dan data accuracy",
      responsibilities: [
        "Mengembangkan fitur user-accessible untuk situs web inventory alat lab",
        "Optimasi aplikasi web untuk kecepatan dan skalabilitas",
        "Konversi sertifikat fisik ke PDF dan input ke Microsoft Excel/Word",
        "Database management dan data validation",
        "UI/UX improvement berdasarkan user feedback",
        "Cross-browser compatibility testing",
      ],
      achievements: [
        "Peningkatan user satisfaction score hingga 85%",
        "Optimasi loading time aplikasi hingga 60% lebih cepat",
        "Accurate data entry dengan error rate < 1%",
      ],
    },
  ],

  projects: {
    totalCompleted: "25+",
    categories: [
      "E-commerce Websites",
      "Management Systems",
      "Portfolio Websites",
      "3D Interactive Experiences",
      "Landing Pages",
      "Web Applications",
    ],
    specialties: [
      "Interactive 3D web experiences dengan Three.js dan WebGL",
      "Responsive web applications dengan React dan modern frameworks",
      "Fullstack development dengan Laravel dan Node.js integration",
      "E-commerce dan top-up game websites dengan payment integration",
      "Management systems untuk berbagai industri",
      "Creative portfolio dan landing pages dengan advanced animations",
    ],
    keyProjects: [
      {
        name: "Liboyy Store - Gaming Top-Up Platform",
        tech: ["React", "Node.js", "PostgreSQL", "Payment Gateway"],
        description:
          "Complete e-commerce solution untuk top-up game dengan secure payment system",
      },
      {
        name: "Mbuutt Laundry Management System",
        tech: ["Laravel", "MySQL", "Bootstrap", "jQuery"],
        description:
          "Comprehensive laundry management system dengan automated workflow",
      },
      {
        name: "Personal 3D Portfolio Website",
        tech: ["React", "Three.js", "GSAP", "Tailwind CSS"],
        description:
          "Interactive 3D portfolio dengan advanced animations dan creative UI",
      },
      {
        name: "Spektrum Lab Inventory System",
        tech: ["JavaScript", "PHP", "MySQL", "CSS3"],
        description:
          "User-friendly inventory management untuk peralatan laboratorium",
      },
    ],
  },

  services: [
    {
      category: "Web Development",
      services: [
        "Custom Web Development from scratch",
        "Responsive Website Design & Development",
        "E-commerce Website Development",
        "Web Application Development",
        "Website Redesign & Modernization",
      ],
    },
    {
      category: "Specialized Development",
      services: [
        "3D Interactive Web Experiences dengan Three.js",
        "Fullstack JavaScript Development (MERN/MEAN Stack)",
        "Laravel Web Applications dengan PHP",
        "Progressive Web Apps (PWA) Development",
        "API Development & Integration",
      ],
    },
    {
      category: "Technical Services",
      services: [
        "Database Design & Integration (PostgreSQL, MySQL)",
        "Website Performance Optimization",
        "SEO-friendly Development",
        "Cross-browser Compatibility",
        "Mobile-first Responsive Design",
      ],
    },
    {
      category: "Creative Services",
      services: [
        "Creative UI/UX Implementation",
        "Advanced Animations dengan GSAP & Framer Motion",
        "Interactive Portfolio Development",
        "Landing Page dengan High Conversion Rate",
        "Creative Web Experiences",
      ],
    },
  ],

  pricing: {
    websiteTypes: {
      "Landing Page":
        "Starting from $300 - Professional landing page dengan modern design",
      "Portfolio Website":
        "$500-800 - Complete portfolio dengan interactive features",
      "E-commerce Website":
        "$800-1500 - Full e-commerce solution dengan payment integration",
      "Web Application": "$1000-2500 - Custom web application sesuai kebutuhan",
      "3D Interactive Website":
        "$1200-2000 - Advanced 3D web experience dengan Three.js",
    },
    hourlyRate: "$15-25/hour - Depending on project complexity",
    projectBased:
      "Preferred pricing model dengan fixed price berdasarkan scope",
  },

  clientTestimonials: [
    {
      client: "Liboyy Store",
      project: "Gaming Top-Up Platform",
      rating: "★★★★★",
      feedback:
        "Exceptional fullstack developer dengan kemampuan teknis luar biasa. Berhasil membangun website top-up games yang responsif, cepat, dan user-friendly. Communication excellent dan delivery tepat waktu.",
    },
    {
      client: "Mbuutt Company",
      project: "Laundry Management System",
      rating: "★★★★★",
      feedback:
        "Pengalaman yang sangat profesional dengan Azriel. Komitmen terhadap ketepatan waktu, kualitas hasil, dan perhatian detail sangat terlihat. System yang dibangun user-friendly dan sesuai kebutuhan bisnis.",
    },
    {
      client: "PT. Spektrum Kreasi Pratama",
      project: "Laboratory Inventory System",
      rating: "★★★★☆",
      feedback:
        "Azriel membawa kreativitas dan keahlian teknis ke dalam tim. Berhasil meningkatkan performance frontend dan accuracy data entry secara signifikan. Great team player dengan problem-solving skills yang baik.",
    },
  ],

  coreValues: [
    {
      title: "Quality-First Approach",
      description:
        "Memberikan hasil berkualitas tinggi dengan memperhatikan setiap detail teknis dan user experience",
      icon: "🎯",
    },
    {
      title: "Transparent Communication",
      description:
        "Menjaga transparansi dan kejelasan komunikasi di setiap tahap proyek dengan regular updates",
      icon: "💬",
    },
    {
      title: "On-Time Delivery",
      description:
        "Memastikan proyek selesai sesuai jadwal dengan kualitas terjaga dan testing yang comprehensive",
      icon: "⏰",
    },
    {
      title: "Continuous Learning",
      description:
        "Selalu mengikuti perkembangan teknologi terbaru untuk memberikan solusi yang modern dan efficient",
      icon: "📚",
    },
  ],

  contact: {
    primaryEmail: "azrlwebdev@gmail.com",
    website: "https://azrl-webdev.vercel.app/",
    socialMedia: {
      instagram: "https://www.instagram.com/azrlrsdi_/",
      github: "https://github.com/AzrielRosadi",
      linkedin: "https://www.linkedin.com/in/azriel-rosadi-aa2859343/",
    },
    availability: "Available for new projects and collaborations",
    responseTime: "Usually responds within 24 hours",
    preferredContact: "Email or website contact form for project inquiries",
  },

  currentStatus:
    "Sedang menjalani program internship di Starspace Studio sebagai Front-End Developer Intern dan terbuka untuk project collaboration serta freelance opportunities",

  faqs: [
    {
      question: "Apa spesialisasi utama Azriel?",
      answer:
        "Spesialisasi utama adalah fullstack web development dengan keahlian khusus dalam 3D interactive web experiences menggunakan Three.js, React.js development, dan Laravel backend development.",
    },
    {
      question: "Berapa lama pengerjaan project biasanya?",
      answer:
        "Timeline bervariasi: Landing page (1-2 minggu), Portfolio website (2-3 minggu), E-commerce (3-4 minggu), Web application (4-6 minggu), tergantung kompleksitas dan requirements.",
    },
    {
      question: "Apakah menyediakan maintenance setelah project selesai?",
      answer:
        "Ya, menyediakan maintenance support dan minor updates. Untuk major updates atau feature additions, bisa didiskusikan dengan pricing terpisah.",
    },
    {
      question: "Teknologi apa yang paling sering digunakan?",
      answer:
        "Tech stack utama: React.js/Next.js untuk frontend, Node.js/Laravel untuk backend, PostgreSQL/MySQL untuk database, dan Three.js untuk 3D experiences.",
    },
  ],
};

let websiteDataCache = {
  data: null,
  lastUpdated: null,
  isValid: function () {
    if (!this.data || !this.lastUpdated) return false;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - this.lastUpdated < fiveMinutes;
  },
};

// Enhanced scraping function (keeping your original logic)
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
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    const scrapedData = {
      title: $("title").text() || "Azriel Rosadi Portfolio",
      metaDescription: $('meta[name="description"]').attr("content") || "",
      headings: [],
      links: [],
      images: [],
      technologies: [],
      projects: [],
      lastScraped: new Date().toISOString(),
    };

    // Extract headings
    $("h1, h2, h3, h4, h5, h6").each((i, el) => {
      const text = $(el).text().trim();
      if (text) {
        scrapedData.headings.push({
          level: el.tagName.toLowerCase(),
          text: text,
        });
      }
    });

    // Extract technology mentions
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
      "Framer Motion",
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

    console.log("✅ Website data scraped successfully");
    return scrapedData;
  } catch (error) {
    console.error("❌ Error scraping website:", error.message);
    return {
      title: "Azriel Rosadi - Web Developer Portfolio",
      metaDescription:
        "Professional web developer specializing in React, Three.js, and fullstack development",
      headings: [
        { level: "h1", text: "Azriel Rosadi - Web Developer & 3D Enthusiast" },
      ],
      technologies: ["React", "Three.js", "JavaScript", "Laravel", "Node.js"],
      projects: [
        "Interactive 3D portfolio website",
        "E-commerce gaming platform",
      ],
      error: error.message,
      lastScraped: new Date().toISOString(),
    };
  }
}

// Enhanced contextual response generator
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
🌟 SPESIALISASI UTAMA AZRIEL:
• Interactive 3D web experiences menggunakan Three.js dan WebGL
• Modern responsive web applications dengan React.js/Next.js
• Fullstack development dengan Laravel dan Node.js
• E-commerce platforms dengan secure payment integration

📊 STATISTIK PROFESIONAL:
• Total Projects Completed: 25+
• Client Satisfaction Rate: 95%
• Technologies Mastered: 15+
• Years Active: 2+

🛠️ TEKNOLOGI DARI WEBSITE: ${websiteData.technologies.join(", ")}
    `;
  }

  if (
    message.includes("teknologi") ||
    message.includes("tech") ||
    message.includes("skill")
  ) {
    contextualInfo = `
💻 TECH STACK AZRIEL:

🎨 FRONTEND EXCELLENCE:
• React.js, Next.js, TypeScript, JavaScript ES6+
• Three.js untuk 3D web experiences yang menakjubkan
• GSAP & Framer Motion untuk advanced animations
• Tailwind CSS, SCSS untuk modern styling

⚙️ BACKEND & DATABASE:
• Node.js dengan Express.js untuk REST APIs
• Laravel dengan PHP untuk robust web applications
• PostgreSQL & MySQL untuk data management

🔧 SPECIALIZED SKILLS:
• 3D Web Development dengan WebGL
• Progressive Web Apps (PWA)
• Mobile-first Responsive Design
• Performance Optimization
    `;
  }

  if (
    message.includes("kontak") ||
    message.includes("contact") ||
    message.includes("hire")
  ) {
    contextualInfo = `
📞 KONTAK & COLLABORATION:

✉️ Email: azrlwebdev@gmail.com
🌐 Website: https://azrl-webdev.vercel.app/
📱 Response Time: Usually within 24 hours

💼 AVAILABLE SERVICES:
• Custom Web Development ($300-2500)
• 3D Interactive Experiences ($1200-2000)
• E-commerce Solutions ($800-1500)
• Fullstack Applications ($1000-2500)

⏰ Status: Available untuk new projects
    `;
  }

  if (
    message.includes("harga") ||
    message.includes("price") ||
    message.includes("biaya")
  ) {
    contextualInfo = `
💰 PRICING PACKAGES:

📋 WEBSITE DEVELOPMENT:
🔸 Landing Page: $300+
🔸 Portfolio Website: $500-800
🔸 E-commerce Site: $800-1500
🔸 Web Application: $1000-2500
🔸 3D Interactive Site: $1200-2000

⏰ Hourly Rate: $15-25/hour
🎯 Preferred: Fixed-price projects

✅ INCLUDED:
• Responsive design untuk semua devices
• SEO optimization & performance tuning
• Cross-browser compatibility
• Basic maintenance support
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

// MAIN CHAT ENDPOINT - Enhanced with better AI formatting
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("💬 Received message:", message);

    // Generate contextual information
    const contextualInfo = await generateContextualPrompt(message);
    const websiteData = await scrapeWebsiteData();

    // Enhanced system prompt untuk response yang lebih terstruktur
    const systemPrompt = `Anda adalah AI Assistant profesional untuk portfolio Azriel Rosadi, Web Developer & 3D Enthusiast.

🎯 WEBSITE DATA (Real-time):
Title: ${websiteData.title}
Technologies: ${websiteData.technologies.join(", ")}
Last Updated: ${websiteData.lastScraped}

${contextualInfo}

📝 RESPONSE FORMAT REQUIREMENTS:

STRUKTUR YANG DIHARAPKAN:
1. Sapaan yang warm dan professional
2. Informasi utama dalam sections dengan emoji headers
3. Detail dalam bullet points yang rapi
4. Statistics/examples yang konkret
5. Call-to-action yang jelas

FORMAT GUIDELINES:
• Gunakan emoji untuk section headers (🌟, 💻, 📊, 🚀)
• Format bullet points dengan emoji bullets (🔸, ✨, ⭐, 💼)
• Gunakan **bold** untuk key information
• Gunakan *italic* untuk emphasis
• Pisahkan sections dengan line breaks yang cukup
• Berikan informasi yang specific dan actionable

TONE & STYLE:
• Professional namun approachable
• Enthusiastic tentang teknologi
• Bahasa Indonesia yang natural
• Highlight keunggulan teknis Azriel
• Sertakan contact info jika relevan

CONTENT FOCUS:
• Technical expertise (React, Three.js, Laravel, Node.js)
• Real achievements dan statistics
• Current availability dan services
• 3D web development specialization
• 25+ projects dengan 95% client satisfaction

Berikan response yang terstruktur, informatif, dan engaging sesuai format di atas!`;

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
                  text: `${systemPrompt}\n\n👤 User Question: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
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
      console.error(
        "❌ Gemini API Error:",
        response.status,
        response.statusText
      );
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract dan format response
    let rawResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi atau hubungi langsung melalui email azrlwebdev@gmail.com";

    // Apply enhanced formatting
    let aiResponse = cleanAndFormatResponse(rawResponse);

    // Post-processing untuk personalization
    if (
      aiResponse &&
      !aiResponse.includes("Azriel") &&
      (message.toLowerCase().includes("siapa") ||
        message.toLowerCase().includes("who"))
    ) {
      const personalizedIntro = cleanAndFormatResponse(
        "🌟 **Halo!** Saya adalah AI Assistant untuk **Azriel Rosadi**, Web Developer & 3D Enthusiast yang berpengalaman.\n\n"
      );
      aiResponse = personalizedIntro + aiResponse;
    }

    console.log("✅ AI Response generated and formatted successfully");

    res.json({
      response: aiResponse,
      metadata: {
        websiteLastScraped: websiteData.lastScraped,
        technologiesFound: websiteData.technologies.length,
        formatted: true,
        responseLength: aiResponse.length,
      },
    });
  } catch (error) {
    console.error("❌ Error in chat endpoint:", error);

    // Enhanced fallback response dengan proper formatting
    const message = req.body.message?.toLowerCase() || "";
    let fallbackResponse = "";

    if (message.includes("proyek") || message.includes("project")) {
      fallbackResponse = `
🌟 **PORTFOLIO AZRIEL ROSADI**

🚀 **Spesialisasi:**
🔸 Interactive 3D web experiences dengan Three.js
🔸 Modern web applications dengan React/Next.js
🔸 E-commerce platforms dengan secure payment
🔸 Fullstack development dengan Laravel & Node.js

📊 **Statistics:**
🔸 **25+** completed projects
🔸 **95%** client satisfaction rate
🔸 **15+** technologies mastered

✨ **Project Highlights:**
🔸 **Liboyy Store** - Gaming top-up platform
🔸 **Mbuutt Laundry** - Management system
🔸 **Personal 3D Portfolio** - Creative showcase

🌐 Explore website: https://azrl-webdev.vercel.app/
      `;
    } else if (message.includes("kontak") || message.includes("contact")) {
      fallbackResponse = `
📞 **HUBUNGI AZRIEL**

✉️ **Email:** azrlwebdev@gmail.com
🌐 **Website:** https://azrl-webdev.vercel.app/
📱 **Response Time:** Usually within 24 hours

💼 **Available Services:**
🔸 Custom Web Development ($300-2500)
🔸 3D Interactive Experiences ($1200-2000)
🔸 E-commerce Solutions ($800-1500)
🔸 Fullstack Applications ($1000-2500)

🤝 **Status:** Available untuk new projects dan collaborations
      `;
    } else {
      fallbackResponse = `
🌟 **AZRIEL ROSADI - WEB DEVELOPER & 3D ENTHUSIAST**

💻 **Expertise:**
🔸 React.js, Next.js, Three.js
🔸 Laravel, Node.js, PostgreSQL
🔸 3D Web Development
🔸 Interactive UI/UX

📊 **Experience:**
🔸 Front-End Developer Intern di Starspace Studio
🔸 25+ completed projects
🔸 95% client satisfaction

📞 **Contact:** azrlwebdev@gmail.com
🌐 **Website:** https://azrl-webdev.vercel.app/
      `;
    }

    const formattedFallback = cleanAndFormatResponse(fallbackResponse);

    res.status(500).json({
      error: "Internal server error",
      response: formattedFallback,
      fallback: true,
      formatted: true,
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
      version: "3.0.0",
      features: [
        "Enhanced response formatting",
        "Real-time website scraping",
        "Structured AI responses",
        "Professional styling",
        "Mobile responsive design",
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
      portfolio: azrielKnowledgeBase,
      server: "Azriel Portfolio Chatbot API v3.0",
      status: "Active",
      features: {
        enhancedFormatting: "Professional response styling with CSS",
        realTimeData: "Website scraping dengan caching",
        structuredResponses: "Organized sections dengan emojis",
        responsiveDesign: "Mobile-friendly formatting",
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

// Test formatting endpoint
app.get("/api/test-format", (req, res) => {
  const testResponse = `
🌟 **TESTING RESPONSE FORMAT**

💻 **Technical Skills:**
🔸 React.js development
🔸 Three.js 3D experiences
🔸 Laravel backend systems

📞 **Contact Information:**
✉️ Email: azrlwebdev@gmail.com
🌐 Website: https://azrl-webdev.vercel.app/

💰 **Pricing:**
🔸 Landing Page: $300+
🔸 Web Application: $1000-2500

*This is italic text* and **this is bold text**.
  `;

  const formatted = cleanAndFormatResponse(testResponse);

  res.json({
    original: testResponse,
    formatted: formatted,
    message: "Enhanced formatting test completed",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("💥 Unhandled error:", err.stack);

  const errorResponse = cleanAndFormatResponse(`
🚨 **System Error**

Maaf, terjadi kesalahan teknis. Tim Azriel sedang memperbaikinya!

📞 **Alternative Contact:**
✉️ Email: azrlwebdev@gmail.com  
🌐 Website: https://azrl-webdev.vercel.app/
  `);

  res.status(500).json({
    error: "Something went wrong!",
    response: errorResponse,
    timestamp: new Date().toISOString(),
    formatted: true,
  });
});

// Server startup
app.listen(PORT, async () => {
  console.log(
    `🚀 Azriel Portfolio Chatbot Server v3.0 running on port ${PORT}`
  );
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
  console.log(`💬 Enhanced chatbot with professional formatting ready`);
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

  console.log(`\n🎯 Enhanced features enabled:`);
  console.log(`   ✅ Professional response formatting with CSS`);
  console.log(`   ✅ Structured sections dengan emoji headers`);
  console.log(`   ✅ Clickable email & URL links`);
  console.log(`   ✅ Mobile responsive design`);
  console.log(`   ✅ Smooth animations dan hover effects`);
  console.log(`   ✅ Enhanced AI contextual responses`);
  console.log(`   ✅ Real-time website data integration`);
  console.log(`   ✅ Comprehensive fallback support`);
  console.log(`   ✅ 5-minute intelligent caching system`);
  console.log(`\n📱 Available endpoints:`);
  console.log(`   POST /api/chat - Main chatbot interface`);
  console.log(`   GET  /api/health - Server health check`);
  console.log(`   GET  /api/info - Portfolio information`);
  console.log(`   GET  /api/test-format - Response formatting test`);
  console.log(`\n🎨 Response features:`);
  console.log(`   • Clean structured sections with emoji headers`);
  console.log(`   • Professional bullet points dengan hover effects`);
  console.log(`   • Clickable contact links dengan styling`);
  console.log(`   • Price highlighting dan formatting`);
  console.log(`   • Mobile-responsive design`);
  console.log(`   • Smooth fade-in animations`);
  console.log(`\n🤖 AI Enhancement:`);
  console.log(`   • Contextual responses berdasarkan user intent`);
  console.log(`   • Real-time website data integration`);
  console.log(`   • Professional tone dengan informative content`);
  console.log(`   • Clear call-to-actions`);
  console.log(`   • Comprehensive error handling`);
  console.log(`\n🎯 Ready to serve professional chatbot responses!`);
});
