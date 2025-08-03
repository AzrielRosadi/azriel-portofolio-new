// lib/scraper.js - Vercel Compatible Web Scraper
export const scrapeWebsiteData = async () => {
  try {
    // For Vercel serverless functions, we'll use a simple fetch approach
    // You can enhance this with more sophisticated scraping if needed

    const websiteUrl = "https://azrl-webdev.vercel.app/";

    const response = await fetch(websiteUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Portfolio-Bot/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 10000, // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Simple HTML parsing for basic information
    const title = extractTitle(html) || "Azriel Rosadi Portfolio";
    const technologies = extractTechnologies(html);

    return {
      title,
      technologies,
      lastScraped: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    console.warn("Website scraping failed:", error.message);

    // Return fallback data
    return {
      title: "Azriel Rosadi - Web Developer & 3D Enthusiast",
      technologies: [
        "React.js",
        "Next.js",
        "Three.js",
        "Laravel",
        "Node.js",
        "PostgreSQL",
        "TypeScript",
        "Tailwind CSS",
      ],
      lastScraped: new Date().toISOString(),
      error: error.message,
    };
  }
};

// Simple title extraction
const extractTitle = (html) => {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : null;
};

// Simple technology extraction based on common patterns
const extractTechnologies = (html) => {
  const technologies = [];
  const techKeywords = {
    React: ["react", "jsx", "react.js"],
    "Next.js": ["next", "nextjs", "next.js"],
    "Three.js": ["three", "threejs", "three.js", "webgl", "3d"],
    Laravel: ["laravel", "php"],
    "Node.js": ["node", "nodejs", "node.js"],
    PostgreSQL: ["postgresql", "postgres", "pg"],
    TypeScript: ["typescript", "ts"],
    "Tailwind CSS": ["tailwind", "tailwindcss"],
    JavaScript: ["javascript", "js"],
    Python: ["python", "py"],
    MongoDB: ["mongodb", "mongo"],
    MySQL: ["mysql", "sql"],
    "Vue.js": ["vue", "vuejs"],
    Angular: ["angular", "ng"],
    Express: ["express", "expressjs"],
    Docker: ["docker", "container"],
    AWS: ["aws", "amazon web services"],
    Vercel: ["vercel", "deployment"],
  };

  const lowerHtml = html.toLowerCase();

  Object.entries(techKeywords).forEach(([tech, keywords]) => {
    if (keywords.some((keyword) => lowerHtml.includes(keyword))) {
      technologies.push(tech);
    }
  });

  return [...new Set(technologies)]; // Remove duplicates
};

// Generate contextual information based on user message
export const generateContext = (message, websiteData) => {
  const lowerMessage = message.toLowerCase();

  let context = `CONTEXTUAL INFO:\n`;

  if (lowerMessage.includes("project") || lowerMessage.includes("proyek")) {
    context += `- User asking about projects\n`;
    context += `- Focus on portfolio showcase and completed works\n`;
    context += `- Mention specific project types and achievements\n`;
  }

  if (lowerMessage.includes("tech") || lowerMessage.includes("teknologi")) {
    context += `- User asking about technology stack\n`;
    context += `- Current tech stack: ${websiteData.technologies
      .slice(0, 6)
      .join(", ")}\n`;
    context += `- Emphasize modern web development capabilities\n`;
  }

  if (lowerMessage.includes("contact") || lowerMessage.includes("kontak")) {
    context += `- User looking for contact information\n`;
    context += `- Provide direct contact details and response time\n`;
    context += `- Mention availability for new projects\n`;
  }

  if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("harga") ||
    lowerMessage.includes("cost")
  ) {
    context += `- User inquiring about pricing\n`;
    context += `- Provide service categories with price ranges\n`;
    context += `- Emphasize value and quality delivered\n`;
  }

  return context;
};
