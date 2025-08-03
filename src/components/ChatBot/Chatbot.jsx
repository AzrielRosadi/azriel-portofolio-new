import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Bot,
  User,
  Globe,
  Zap,
  ArrowUp,
  ArrowDown,
  Mail,
} from "lucide-react";

// Enhanced ChatMessage Component - Render text with formatting
const ChatMessage = ({ message, index }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function untuk parse text dengan bold, email, dan links
  const parseText = (text) => {
    if (!text) return [];

    // Clean up mailto: prefix dari text
    let cleanText = text.replace(/mailto:/g, "");

    // Regex untuk menangkap **bold**, email, dan URL
    const regex =
      /(\*\*[^*]+\*\*|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s]+)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanText)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: cleanText.slice(lastIndex, match.index),
        });
      }

      const matched = match[0];

      if (matched.startsWith("**") && matched.endsWith("**")) {
        // Bold text
        parts.push({
          type: "bold",
          content: matched.slice(2, -2),
        });
      } else if (matched.includes("@") && matched.includes(".")) {
        // Email
        parts.push({
          type: "email",
          content: matched,
        });
      } else if (matched.startsWith("http")) {
        // URL
        parts.push({
          type: "url",
          content: matched,
        });
      } else {
        // Regular text
        parts.push({
          type: "text",
          content: matched,
        });
      }

      lastIndex = match.index + matched.length;
    }

    // Add remaining text
    if (lastIndex < cleanText.length) {
      parts.push({
        type: "text",
        content: cleanText.slice(lastIndex),
      });
    }

    return parts;
  };

  // Render parsed parts
  const renderParsedText = (parts) => {
    return parts.map((part, index) => {
      switch (part.type) {
        case "bold":
          return (
            <strong
              key={index}
              className={`font-bold ${
                message.sender === "user" ? "text-white" : "text-gray-900"
              }`}
              style={{ fontWeight: 700 }}
            >
              {part.content}
            </strong>
          );
        case "email":
          return (
            <a
              key={index}
              href={`mailto:${part.content}`}
              className={`inline-flex items-center gap-1 no-underline hover:underline transition-colors ${
                message.sender === "user"
                  ? "text-blue-300 hover:text-blue-200"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              <Mail size={12} />
              {part.content}
            </a>
          );
        case "url":
          return (
            <a
              key={index}
              href={part.content}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 no-underline hover:underline transition-colors ${
                message.sender === "user"
                  ? "text-blue-300 hover:text-blue-200"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              <Globe size={12} />
              {part.content}
            </a>
          );
        default:
          return <span key={index}>{part.content}</span>;
      }
    });
  };

  // Parse text menjadi lines dan handle setiap line
  const renderFormattedText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, lineIndex) => {
      const parsedParts = parseText(line);
      return (
        <div key={lineIndex} className={lineIndex > 0 ? "mt-2" : ""}>
          {renderParsedText(parsedParts)}
        </div>
      );
    });
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-4 px-2 sm:px-0`}
      style={{
        animation: `messageSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        transform:
          message.sender === "user" ? "translateX(50px)" : "translateX(-50px)",
      }}
    >
      <div
        className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
          message.sender === "user"
            ? "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white border border-gray-500/30"
            : "bg-gradient-to-br from-white/90 via-gray-50/90 to-gray-100/90 text-gray-800 border border-white/50 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          {message.sender === "bot" && (
            <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-sm animate-pulse">
              <Bot size={12} className="sm:w-3.5 sm:h-3.5 text-gray-600" />
            </div>
          )}
          {message.sender === "user" && (
            <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-sm">
              <User size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed font-medium break-words">
              {renderFormattedText(message.text)}
            </div>
            <p
              className={`text-xs mt-2 font-light transition-opacity duration-300 ${
                message.sender === "user" ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 **Halo! Saya AI Assistant untuk portfolio Azriel Rosadi!**\n\n✨ Saya menggunakan **data real-time** dari website dan siap membantu Anda:\n\n🚀 **Pengalaman & Proyek** (25+ completed)\n💻 **Tech Stack & Skills**\n💼 **Info Layanan & Pricing**\n📞 **Kontak & Kolaborasi**\n\nAda yang ingin Anda ketahui? Silakan bertanya! 🎯",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [scrollPosition, setScrollPosition] = useState("bottom");
  const messagesEndRef = useRef(null);
  const messagesStartRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Enhanced scroll management
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  };

  const scrollToTop = (smooth = true) => {
    messagesStartRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
  };

  // Check scroll position to determine which arrow to show
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

      if (scrollPercentage < 0.1) {
        setScrollPosition("top");
      } else if (scrollPercentage > 0.9) {
        setScrollPosition("bottom");
      } else {
        setScrollPosition("middle");
      }
    }
  };

  // Prevent scroll propagation to parent elements
  const handleWheel = (e) => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      setHasAnimatedIn(true);
    }, 2800);

    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  useEffect(() => {
    const checkOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);
    return () => {
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
  }, []);

  const toggleChat = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (isOpen) {
      document.body.classList.remove("chat-open");
      setTimeout(() => {
        setIsOpen(false);
        setIsTransitioning(false);
      }, 500);
    } else {
      setIsOpen(true);
      document.body.classList.add("chat-open");
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  };

  // Enhanced API call with better error handling
  const sendToAPI = async (message, retryCount = 0) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased timeout

      console.log(
        "🚀 Sending message to API:",
        message.substring(0, 50) + "..."
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("✅ API response received");

      return (
        data.response || data.text || "Maaf, tidak ada respons dari server."
      );
    } catch (error) {
      console.error("❌ API Error:", error);

      // Retry logic for network errors
      if (
        retryCount < 2 &&
        (error.name === "AbortError" ||
          error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("Failed to fetch"))
      ) {
        console.log(`🔄 Retrying API call... (${retryCount + 1}/3)`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return sendToAPI(message, retryCount + 1);
      }

      // Enhanced fallback responses
      if (!isOnline) {
        return "🔌 **Koneksi terputus.** Silakan periksa internet Anda.\n\n📧 **Kontak langsung:** azrlwebdev@gmail.com\n🌐 **Portfolio:** https://azrl-webdev.vercel.app/";
      }

      const msg = message.toLowerCase();

      if (msg.includes("proyek") || msg.includes("project")) {
        return "🚀 **Portfolio Azriel - 25+ Projects Completed!**\n\n• **Platform Top-up Game & Social Media** - React, TypeScript, Node.js\n• **System Laundry Website** - Laravel 11, MySQL\n• **DOML AI Marketing Platform** - React, AI Integration\n• **Mechstrom: War Zone Game** - Unity, C#\n\n🌐 **Detail lengkap:** https://azrl-webdev.vercel.app/\n📧 **Diskusi proyek:** azrlwebdev@gmail.com";
      }

      if (msg.includes("kontak") || msg.includes("contact")) {
        return "📞 **Kontak Azriel Rosadi:**\n\n✉️ **Email:** azrlwebdev@gmail.com\n🌐 **Portfolio:** https://azrl-webdev.vercel.app/\n💼 **GitHub:** https://github.com/AzrielRosadi\n\n⚡ **Response Time:** < 24 jam";
      }

      if (msg.includes("pengalaman") || msg.includes("experience")) {
        return "💼 **Pengalaman Kerja Azriel:**\n\n🏢 **Frontend Developer & Data Entry** - PT. Spektrum Kreasi Pratama\n🏢 **Fullstack Laravel Developer** - Mbuutt Laundry\n🏢 **Fullstack JavaScript Developer** - Liboyy Store\n🏢 **Frontend Developer Intern** - Starspace Studio (Current)\n\n📈 **Achievement:** 25+ completed projects, 90% client retention rate";
      }

      if (msg.includes("skill") || msg.includes("teknologi")) {
        return "💻 **Tech Stack Azriel:**\n\n**Frontend:** React, TypeScript, TailwindCSS, Next.js\n**Backend:** Node.js, Laravel, Express.js\n**Database:** PostgreSQL, MySQL, MongoDB\n**Others:** Unity, Python, Git, Vercel\n\n🚀 **Spesialisasi:** Fullstack Development, API Integration, Real-time Applications";
      }

      return "😅 **Server sedang maintenance.** Coba lagi sebentar!\n\n🤖 **Sementara itu, Anda bisa:**\n• Bertanya tentang **proyek** Azriel\n• Info **kontak** dan kolaborasi\n• Detail **pengalaman** kerja\n• **Tech stack** yang dikuasai\n\n📧 **Email langsung:** azrlwebdev@gmail.com\n🌐 **Portfolio:** https://azrl-webdev.vercel.app/";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("📤 Sending message:", inputMessage);
      const botResponse = await sendToAPI(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      console.log("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Error in handleSendMessage:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "🚨 **Terjadi kesalahan teknis.**\n\nSilakan coba lagi atau hubungi langsung:\n📧 **azrlwebdev@gmail.com**\n🌐 **https://azrl-webdev.vercel.app/**",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScrollNavigation = () => {
    if (scrollPosition === "top") {
      scrollToBottom();
    } else {
      scrollToTop();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes chatbotEntranceDirect {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(100px);
          }
          40% {
            opacity: 0.8;
            transform: scale(1.2) translateY(-20px);
          }
          60% {
            opacity: 1;
            transform: scale(0.9) translateY(10px);
          }
          80% {
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes chatWindowOpen {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(80px) rotateX(15deg);
            filter: blur(15px);
          }
          20% {
            opacity: 0.4;
            transform: scale(0.9) translateY(40px) rotateX(8deg);
            filter: blur(10px);
          }
          40% {
            opacity: 0.7;
            transform: scale(1.08) translateY(-15px) rotateX(-3deg);
            filter: blur(5px);
          }
          60% {
            opacity: 0.9;
            transform: scale(0.96) translateY(8px) rotateX(1deg);
            filter: blur(2px);
          }
          80% {
            opacity: 1;
            transform: scale(1.02) translateY(-3px) rotateX(0deg);
            filter: blur(1px);
          }
          90% {
            transform: scale(0.99) translateY(1px) rotateX(0deg);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
            filter: blur(0px);
          }
        }

        @keyframes chatWindowClose {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
            filter: blur(0px);
          }
          20% {
            opacity: 0.9;
            transform: scale(1.03) translateY(-5px) rotateX(-2deg);
            filter: blur(1px);
          }
          40% {
            opacity: 0.7;
            transform: scale(0.95) translateY(10px) rotateX(3deg);
            filter: blur(3px);
          }
          70% {
            opacity: 0.4;
            transform: scale(0.8) translateY(30px) rotateX(8deg);
            filter: blur(8px);
          }
          100% {
            opacity: 0;
            transform: scale(0.6) translateY(60px) rotateX(15deg);
            filter: blur(15px);
          }
        }

        @keyframes messageSlideIn {
          0% {
            opacity: 0;
            transform: translateX(var(--slide-direction, -50px))
              translateY(20px) scale(0.9);
          }
          50% {
            opacity: 0.7;
            transform: translateX(calc(var(--slide-direction, -50px) * 0.3))
              translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
        }

        @keyframes buttonBounce {
          0%,
          100% {
            transform: scale(1) translateY(0px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          20% {
            transform: scale(1.1) translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }
          40% {
            transform: scale(0.95) translateY(3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          60% {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
          }
          80% {
            transform: scale(0.98) translateY(2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(156, 163, 175, 0.1)
          );
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9ca3af, #6b7280);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #6b7280, #4b5563);
        }

        body.chat-open {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
        }

        @media (max-width: 640px) {
          body.chat-open {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div className="fixed bottom-0 right-0 z-[9999] pointer-events-none">
        <div className="pointer-events-auto">
          <div
            className={`transition-all duration-700 ease-out ${
              isOpen
                ? "opacity-0 scale-0 translate-y-8 rotate-180 pointer-events-none"
                : "opacity-100 scale-100 translate-y-0 rotate-0"
            }`}
            style={{
              animation: hasAnimatedIn
                ? "chatbotEntranceDirect 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                : "none",
            }}
          >
            <div className="p-4 sm:p-6">
              <button
                onClick={toggleChat}
                disabled={isTransitioning}
                className="relative group bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:via-gray-200 hover:to-gray-400 text-gray-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 overflow-hidden"
                style={{
                  animation:
                    hasAnimatedIn && !isTransitioning
                      ? "buttonBounce 4s ease-in-out infinite"
                      : "none",
                }}
                aria-label="Buka chat"
              >
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white transition-all duration-300 ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1200" />

                <div className="relative z-10">
                  <div
                    className={`transition-all duration-700 ease-out ${
                      isTransitioning
                        ? "rotate-180 scale-125"
                        : "rotate-0 scale-100"
                    }`}
                  >
                    <Bot
                      size={20}
                      className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm"
                    />
                    <Globe
                      size={10}
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 absolute -top-1 -right-1 text-blue-600"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div
            className={`fixed inset-0 sm:absolute sm:bottom-0 sm:right-0 sm:top-auto sm:left-auto w-full h-full sm:w-96 sm:h-[36rem] sm:max-h-[calc(100vh-100px)] transition-all duration-600 ease-out ${
              isOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-90 translate-y-8 pointer-events-none"
            }`}
            style={{
              animation: isOpen
                ? "chatWindowOpen 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                : !isTransitioning
                ? "none"
                : "chatWindowClose 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards",
            }}
          >
            <div
              className="w-full h-full bg-white/95 backdrop-blur-xl sm:rounded-2xl sm:shadow-2xl sm:border sm:border-white/50 flex flex-col overflow-hidden"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-white via-gray-100 to-gray-200 text-gray-800 p-4 sm:p-6 flex items-center gap-3 border-b border-white/30 overflow-hidden">
                <div className="relative z-10 p-2 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full animate-pulse">
                  <Bot size={16} className="sm:w-5 sm:h-5 text-gray-700" />
                </div>

                <div className="relative z-10 flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-lg text-gray-800 drop-shadow-sm flex items-center gap-2">
                    AI Assistant
                    <Zap
                      size={12}
                      className="sm:w-4 sm:h-4 text-yellow-600 animate-pulse"
                    />
                  </h3>
                  <p className="text-xs text-gray-600 font-medium flex items-center gap-1 truncate">
                    <span
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                    />
                    {isOnline ? "Live Data • Portfolio Helper" : "Offline Mode"}
                  </p>
                </div>

                <button
                  onClick={toggleChat}
                  disabled={isTransitioning}
                  className="relative z-10 p-2 bg-gradient-to-br from-red-100 via-red-200 to-red-300 hover:from-red-200 hover:via-red-300 hover:to-red-400 text-red-700 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-lg group overflow-hidden"
                  aria-label="Tutup chat"
                >
                  <X
                    size={16}
                    className="sm:w-5 sm:h-5 relative z-10 drop-shadow-sm"
                  />
                </button>
              </div>

              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                onWheel={handleWheel}
                onTouchMove={handleTouchMove}
                className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/50 backdrop-blur-sm relative touch-pan-y custom-scrollbar"
                style={{
                  scrollBehavior: "smooth",
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="p-3 sm:p-6 space-y-2 sm:space-y-3 min-h-full">
                  <div ref={messagesStartRef} />

                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      index={index}
                    />
                  ))}

                  {isLoading && (
                    <div className="flex justify-start mb-4 px-2 sm:px-0">
                      <div className="bg-gradient-to-br from-white/90 via-gray-50/90 to-gray-100/90 backdrop-blur-sm px-3 sm:px-4 py-3 rounded-2xl border border-white/50 shadow-lg">
                        <div className="flex items-center gap-3">
                          <Bot
                            size={14}
                            className="sm:w-4 sm:h-4 text-gray-600 animate-spin"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 animate-pulse">
                              AI sedang menganalisis
                            </span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-bounce" />
                              <div
                                className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                              <div
                                className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {messages.length > 3 && scrollPosition !== "bottom" && (
                  <button
                    onClick={handleScrollNavigation}
                    className="absolute bottom-4 right-4 p-2 sm:p-3 bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:via-gray-200 hover:to-gray-400 text-gray-700 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 group overflow-hidden"
                    aria-label={
                      scrollPosition === "top"
                        ? "Scroll ke bawah"
                        : "Scroll ke atas"
                    }
                  >
                    {scrollPosition === "top" ? (
                      <ArrowDown
                        size={14}
                        className="sm:w-4 sm:h-4 relative z-10 drop-shadow-sm"
                      />
                    ) : (
                      <ArrowUp
                        size={14}
                        className="sm:w-4 sm:h-4 relative z-10 drop-shadow-sm"
                      />
                    )}
                  </button>
                )}
              </div>

              <div className="p-3 sm:p-6 border-t border-white/30 bg-gradient-to-r from-white/80 to-gray-100/80 backdrop-blur-sm sm:rounded-b-2xl">
                <div className="flex gap-2 sm:gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        isOnline
                          ? "Tanya tentang portfolio Azriel..."
                          : "Offline - coba lagi nanti"
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-inner resize-none transition-all duration-300 text-sm hover:shadow-md focus:shadow-lg"
                      disabled={isLoading || !isOnline}
                      maxLength={1000}
                      rows={1}
                      style={{ minHeight: "36px", maxHeight: "120px" }}
                    />

                    {inputMessage.length > 800 && (
                      <div className="absolute bottom-1 right-10 sm:right-12 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded-lg shadow-sm animate-pulse">
                        {1000 - inputMessage.length}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || !isOnline}
                    className="relative group bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:via-gray-200 hover:to-gray-400 disabled:from-gray-200 disabled:to-gray-300 disabled:cursor-not-allowed text-gray-700 p-2 sm:p-3 rounded-xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-lg hover:shadow-xl overflow-hidden hover:scale-105 active:scale-95"
                    style={{
                      animation:
                        !inputMessage.trim() || isLoading || !isOnline
                          ? "none"
                          : "buttonBounce 3s ease-in-out infinite",
                    }}
                    aria-label="Kirim pesan"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <Send
                      size={14}
                      className={`sm:w-4 sm:h-4 relative z-10 drop-shadow-sm transition-transform duration-300 ${
                        isLoading
                          ? "animate-spin"
                          : "group-hover:translate-x-0.5"
                      }`}
                    />

                    {inputMessage.trim() && !isLoading && isOnline && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-green-300/20 rounded-xl animate-pulse" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {isOnline
                        ? "Real-time portfolio data"
                        : "Working offline"}
                    </span>
                    <span className="sm:hidden">
                      {isOnline ? "Live" : "Offline"}
                    </span>
                  </span>

                  {isLoading && (
                    <span className="flex items-center gap-1 animate-pulse">
                      <span className="text-xs text-blue-600">AI typing</span>
                      <div className="flex space-x-0.5">
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
                        <div
                          className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
