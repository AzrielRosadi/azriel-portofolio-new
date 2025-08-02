// Quick knowledge base untuk info endpoint
const azrielPortfolioInfo = {
  personal: {
    name: "Azriel Rosadi",
    title: "Web Developer & 3D Enthusiast",
    website: "https://azrl-webdev.vercel.app/",
    email: "azrlwebdev@gmail.com",
    location: "Indonesia",
    status: "Fresh Graduate - Front-End Developer Intern at Starspace Studio",
    availability: "Available for freelance projects and collaborations",
  },
  stats: {
    experience: "Fresh Graduate with Professional Experience",
    completedProjects: "25+",
    clientSatisfactionRate: "95%",
    technologiesMastered: "15+",
    yearsActive: "2+",
  },
  technologies: {
    frontend: ["React", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3"],
    backend: ["Node.js", "Laravel", "PHP", "Express.js"],
    database: ["PostgreSQL", "MySQL", "MongoDB"],
    specializations: ["Three.js", "GSAP", "Framer Motion", "Tailwind CSS"],
    tools: ["Vite", "Git", "GitHub", "Figma", "VS Code"],
  },
  services: [
    "Custom Web Development",
    "3D Interactive Web Experiences",
    "E-commerce Website Development",
    "Fullstack JavaScript Development",
    "Laravel Web Applications",
    "Progressive Web Apps (PWA)",
    "Website Performance Optimization",
  ],
  pricing: {
    "Landing Page": "$300+",
    "Portfolio Website": "$500-800",
    "E-commerce Website": "$800-1500",
    "Web Application": "$1000-2500",
    "3D Interactive Website": "$1200-2000",
    "Hourly Rate": "$15-25/hour",
  },
  contact: {
    primaryEmail: "azrlwebdev@gmail.com",
    website: "https://azrl-webdev.vercel.app/",
    responseTime: "Usually responds within 24 hours",
    preferredContact: "Email or website contact form",
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["GET"],
    });
  }

  try {
    const infoResponse = {
      portfolio: azrielPortfolioInfo,
      api: {
        name: "Azriel Portfolio Chatbot API",
        version: "3.0.0 Vercel",
        status: "Active",
        platform: "Vercel Serverless",
        lastUpdated: new Date().toISOString(),
      },
      features: {
        enhancedFormatting: "Professional response styling with CSS",
        realTimeData: "Website scraping dengan caching",
        structuredResponses: "Organized sections dengan emojis",
        responsiveDesign: "Mobile-friendly formatting",
        fallbackSupport: "Smart fallback responses",
        vercelDeployment: "Serverless function deployment",
      },
      endpoints: {
        chat: {
          path: "/api/chat",
          method: "POST",
          description: "Main chatbot interface with AI responses",
        },
        health: {
          path: "/api/health",
          method: "GET",
          description: "Health check and system status",
        },
        info: {
          path: "/api/info",
          method: "GET",
          description: "Portfolio information and API details",
        },
      },
      usage: {
        chatEndpoint: {
          url: "/api/chat",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            message: "Your message here",
          },
          example: `
curl -X POST /api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Halo, siapa Azriel?"}'`,
        },
      },
    };

    res.status(200).json(infoResponse);
  } catch (error) {
    console.error("Info endpoint error:", error);

    res.status(500).json({
      error: "Failed to fetch portfolio info",
      message: error.message,
      basicInfo: azrielPortfolioInfo.personal,
      timestamp: new Date().toISOString(),
    });
  }
}
