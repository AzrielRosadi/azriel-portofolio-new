import { scrapeWebsiteData, generateContext } from "../lib/scraper.js";
import { cleanTextResponse } from "../lib/formatter.js";
import { azrielKnowledgeBase } from "../lib/knowledge-base.js";

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
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("💬 Received message:", message.substring(0, 50) + "...");

    // Generate contextual information
    const websiteData = await scrapeWebsiteData();
    const contextualInfo = generateContext(message, websiteData);

    // System prompt
    const systemPrompt = `Anda adalah AI Assistant profesional untuk portfolio Azriel Rosadi, Web Developer & 3D Enthusiast.

INFORMASI AZRIEL:
- Name: ${azrielKnowledgeBase.personal.name}
- Role: ${azrielKnowledgeBase.personal.currentRole}
- Website: ${azrielKnowledgeBase.personal.website}
- Email: ${azrielKnowledgeBase.personal.email}
- Expertise: ${azrielKnowledgeBase.personal.expertise.join(", ")}
- Projects: ${azrielKnowledgeBase.personal.projects}
- Specialization: ${azrielKnowledgeBase.personal.specialization}

WEBSITE DATA (Real-time):
Title: ${websiteData.title}
Technologies: ${websiteData.technologies.join(", ")}
Last Updated: ${websiteData.lastScraped}

${contextualInfo}

INSTRUCTIONS:
1. Jawab dalam bahasa Indonesia yang ramah dan profesional
2. Gunakan emoji secukupnya untuk engagement (🚀, 💻, 📊, ✨)
3. Berikan informasi konkret tentang keahlian Azriel
4. Format response dengan line breaks untuk readability
5. JANGAN gunakan HTML tags, bold markdown, atau formatting markup
6. Berikan jawaban yang informatif dan actionable
7. Highlight 3D web development expertise
8. Sertakan contact info jika relevan

RESPONSE FORMAT:
- Sapaan yang warm
- Informasi utama dengan emoji bullets
- Detail konkret dan statistics
- Call-to-action yang jelas
- PLAIN TEXT ONLY - NO HTML/MARKDOWN FORMATTING

Berikan response yang engaging dan informatif!`;

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
                  text: `${systemPrompt}\n\nUser Question: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
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

    let rawResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi atau hubungi langsung melalui email azrlwebdev@gmail.com";

    // Apply text cleaning
    let aiResponse = cleanTextResponse(rawResponse);

    console.log("✅ Clean text response generated successfully");

    res.json({
      response: aiResponse,
      metadata: {
        websiteLastScraped: websiteData.lastScraped,
        technologiesFound: websiteData.technologies.length,
        cleaned: true,
        responseLength: aiResponse.length,
      },
    });
  } catch (error) {
    console.error("❌ Error in chat endpoint:", error);

    // Smart fallback responses
    const message = req.body.message?.toLowerCase() || "";
    let fallbackResponse = "";

    if (message.includes("proyek") || message.includes("project")) {
      fallbackResponse = `🚀 PORTFOLIO AZRIEL ROSADI

Spesialisasi:
🔸 Interactive 3D web experiences dengan Three.js
🔸 Modern web applications dengan React/Next.js
🔸 E-commerce platforms dengan secure payment
🔸 Fullstack development dengan Laravel & Node.js

Statistics:
🔸 25+ completed projects
🔸 95% client satisfaction rate
🔸 15+ technologies mastered

🌐 Explore website: https://azrl-webdev.vercel.app/`;
    } else if (message.includes("kontak") || message.includes("contact")) {
      fallbackResponse = `📞 HUBUNGI AZRIEL

✉️ Email: azrlwebdev@gmail.com
🌐 Website: https://azrl-webdev.vercel.app/
📱 Response Time: Usually within 24 hours

💼 Available Services:
🔸 Custom Web Development ($300-2500)
🔸 3D Interactive Experiences ($1200-2000)
🔸 E-commerce Solutions ($800-1500)
🔸 Fullstack Applications ($1000-2500)

🤝 Status: Available untuk new projects dan collaborations`;
    } else {
      fallbackResponse = `🌟 AZRIEL ROSADI - WEB DEVELOPER & 3D ENTHUSIAST

💻 Expertise:
🔸 React.js, Next.js, Three.js
🔸 Laravel, Node.js, PostgreSQL
🔸 3D Web Development
🔸 Interactive UI/UX

📊 Experience:
🔸 Front-End Developer Intern di Starspace Studio
🔸 25+ completed projects
🔸 95% client satisfaction

📞 Contact: azrlwebdev@gmail.com
🌐 Website: https://azrl-webdev.vercel.app/`;
    }

    res.status(500).json({
      error: "Internal server error",
      response: fallbackResponse,
      fallback: true,
      cleaned: true,
    });
  }
}
