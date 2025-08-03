import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Bot,
  User,
  Globe,
  Zap,
  Mail,
  Trash2,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

// Enhanced ChatMessage Component with typing animation
const ChatMessage = ({ message, index, onDeleteMessage }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Typing animation effect for bot messages
  useEffect(() => {
    if (message.sender === "bot" && message.text && !message.isTypingComplete) {
      setIsTyping(true);
      setDisplayedText("");

      const text = message.text;
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;

          // Variable typing speed for more natural feel
          const delay = Math.random() * 30 + 20; // 20-50ms
          typingTimeoutRef.current = setTimeout(typeNextChar, delay);
        } else {
          setIsTyping(false);
          message.isTypingComplete = true;
        }
      };

      // Start typing after a small delay
      typingTimeoutRef.current = setTimeout(typeNextChar, 300);

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    } else {
      setDisplayedText(message.text);
      setIsTyping(false);
    }
  }, [message.text, message.sender]);

  // Function untuk parse text dengan bold, email, dan links
  const parseText = (text) => {
    if (!text) return [];

    let cleanText = text.replace(/mailto:/g, "");
    const regex =
      /(\*\*[^*]+\*\*|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s]+)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanText)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: cleanText.slice(lastIndex, match.index),
        });
      }

      const matched = match[0];

      if (matched.startsWith("**") && matched.endsWith("**")) {
        parts.push({
          type: "bold",
          content: matched.slice(2, -2),
        });
      } else if (matched.includes("@") && matched.includes(".")) {
        parts.push({
          type: "email",
          content: matched,
        });
      } else if (matched.startsWith("http")) {
        parts.push({
          type: "url",
          content: matched,
        });
      } else {
        parts.push({
          type: "text",
          content: matched,
        });
      }

      lastIndex = match.index + matched.length;
    }

    if (lastIndex < cleanText.length) {
      parts.push({
        type: "text",
        content: cleanText.slice(lastIndex),
      });
    }

    return parts;
  };

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
      className={`group flex ${
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
        className={`relative max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
          message.sender === "user"
            ? "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white border border-gray-500/30"
            : "bg-gradient-to-br from-white/90 via-gray-50/90 to-gray-100/90 text-gray-800 border border-white/50 backdrop-blur-sm"
        }`}
      >
        {/* Delete button for user messages */}
        {message.sender === "user" && onDeleteMessage && (
          <button
            onClick={() => onDeleteMessage(message.id)}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg hover:scale-110 transform"
            aria-label="Hapus pesan"
          >
            <X size={12} />
          </button>
        )}

        <div className="flex items-start gap-2 sm:gap-3">
          {message.sender === "bot" && (
            <div
              className={`flex-shrink-0 p-1.5 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-sm ${
                isTyping ? "animate-pulse" : ""
              }`}
            >
              <Bot
                size={12}
                className={`sm:w-3.5 sm:h-3.5 text-gray-600 ${
                  isTyping ? "animate-bounce" : ""
                }`}
              />
            </div>
          )}
          {message.sender === "user" && (
            <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-sm">
              <User size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed font-medium break-words">
              {renderFormattedText(displayedText)}
              {isTyping && (
                <span className="inline-block w-2 h-4 ml-1 bg-gray-600 animate-pulse rounded-sm"></span>
              )}
            </div>
            <p
              className={`text-xs mt-2 font-light transition-opacity duration-300 ${
                message.sender === "user" ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {formatTime(message.timestamp)}
              {isTyping && (
                <span className="ml-2 text-blue-500">typing...</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Thinking Animation Component
const ThinkingMessage = () => {
  return (
    <div className="flex justify-start mb-4 px-2 sm:px-0">
      <div className="bg-gradient-to-br from-white/90 via-gray-50/90 to-gray-100/90 backdrop-blur-sm px-3 sm:px-4 py-3 rounded-2xl border border-white/50 shadow-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-sm animate-pulse">
            <Bot size={12} className="sm:w-3.5 sm:h-3.5 text-gray-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              Thinking
            </span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce" />
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
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
      text: "👋 **Halo! Saya AI Assistant untuk portfolio Azriel Rosadi!**\n\n✨ Saya menggunakan **data real-time** dari website dan siap membantu Anda:\n\n🚀 **Pengalaman & Proyek**\n💻 **Tech Stack & Skills**\n💼 **Info Layanan & Pricing**\n📞 **Kontak & Kolaborasi**\n\nAda yang ingin Anda ketahui? Silakan bertanya! 🎯",
      sender: "bot",
      timestamp: new Date(),
      isTypingComplete: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false); // NEW: Thinking state
  const [isOnline, setIsOnline] = useState(true);
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

  // Clear all messages completely
  const clearAllMessages = () => {
    setMessages([]);
  };

  // Delete specific message and its response
  const deleteMessage = (messageId) => {
    setMessages((prev) => {
      const messageIndex = prev.findIndex((msg) => msg.id === messageId);
      if (messageIndex === -1) return prev;

      const newMessages = [...prev];
      // Remove the message and the bot response that follows (if any)
      if (
        messageIndex < newMessages.length - 1 &&
        newMessages[messageIndex + 1].sender === "bot"
      ) {
        newMessages.splice(messageIndex, 2); // Remove both user message and bot response
      } else {
        newMessages.splice(messageIndex, 1); // Remove only the message
      }

      return newMessages;
    });
  };

  // Prevent scroll propagation
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      setHasAnimatedIn(true);
    }, 1000);

    return () => clearTimeout(initialTimer);
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

  // Enhanced API call
  const sendToAPI = async (message, retryCount = 0) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

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

      if (
        retryCount < 2 &&
        (error.name === "AbortError" || error.message.includes("fetch"))
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

      return "😅 **Server sedang maintenance.** Coba lagi sebentar!\n\n📧 **Email langsung:** azrlwebdev@gmail.com\n\n📧 **Portfolio:** https://azrl-webdev.vercel.app/";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isThinking) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      isTypingComplete: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // NEW: Show thinking animation first
    setIsThinking(true);

    // Simulate thinking time (1-3 seconds)
    const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds

    setTimeout(async () => {
      setIsThinking(false);
      setIsLoading(true);

      try {
        console.log("📤 Sending message:", inputMessage);
        const botResponse = await sendToAPI(inputMessage);

        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
          isTypingComplete: false,
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
          isTypingComplete: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, thinkingTime);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes smoothBounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
          60% {
            opacity: 0.9;
            transform: scale(1.1) translateY(-5px);
          }
          80% {
            opacity: 1;
            transform: scale(0.95) translateY(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes gentleFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes botIconFloat {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.05);
          }
        }

        @keyframes globeIconFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          33% {
            transform: translateY(-2px) translateX(1px) scale(1.1);
          }
          66% {
            transform: translateY(-4px) translateX(-1px) scale(1.2);
          }
        }

        @keyframes chatWindowExpandFromIcon {
          0% {
            opacity: 0;
            transform: scale(0.1) translate(20px, 20px);
            transform-origin: bottom right;
          }
          30% {
            opacity: 0.7;
            transform: scale(0.4) translate(15px, 15px);
          }
          70% {
            opacity: 0.95;
            transform: scale(1.05) translate(-2px, -2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
        }

        @keyframes chatWindowShrinkToIcon {
          0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
            transform-origin: bottom right;
          }
          30% {
            opacity: 0.8;
            transform: scale(0.8) translate(5px, 5px);
          }
          70% {
            opacity: 0.4;
            transform: scale(0.3) translate(15px, 15px);
          }
          100% {
            opacity: 0;
            transform: scale(0.05) translate(25px, 25px);
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

        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
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
          {/* Floating Chat Button */}
          <div
            className={`transition-all duration-700 ease-out ${
              isOpen
                ? "opacity-0 scale-0 translate-y-8 rotate-180 pointer-events-none"
                : "opacity-100 scale-100 translate-y-0 rotate-0"
            }`}
          >
            <div className="p-4 sm:p-6">
              <button
                onClick={toggleChat}
                disabled={isTransitioning}
                className="relative group bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:via-gray-200 hover:to-gray-400 text-gray-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 overflow-hidden"
                style={{
                  animation: hasAnimatedIn
                    ? "smoothBounceIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards, gentleFloat 3s ease-in-out infinite 1.2s"
                    : "smoothBounceIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
                }}
                aria-label="Buka chat"
              >
                {/* Online indicator */}
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white transition-all duration-300 ${
                    isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                />

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1200" />

                {/* Icon container */}
                <div className="relative z-10">
                  <div
                    className={`transition-all duration-700 ease-out ${
                      isTransitioning ? "animate-spin scale-125" : "scale-100"
                    }`}
                  >
                    <Bot
                      size={20}
                      className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm"
                      style={{
                        animation:
                          hasAnimatedIn && !isTransitioning
                            ? "botIconFloat 2s ease-in-out infinite"
                            : "none",
                      }}
                    />
                    <Globe
                      size={10}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 absolute -top-1 -right-1 text-blue-600`}
                      style={{
                        animation:
                          hasAnimatedIn && !isTransitioning && isOnline
                            ? "globeIconFloat 2.5s ease-in-out infinite"
                            : "none",
                      }}
                    />
                  </div>
                </div>

                {/* Pulse effect when online */}
                {isOnline && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ animation: "pulseGlow 2s ease-in-out infinite" }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={`fixed inset-0 sm:absolute sm:bottom-0 sm:right-0 sm:top-auto sm:left-auto w-full h-full sm:w-96 sm:h-[36rem] sm:max-h-[calc(100vh-100px)] transition-all duration-600 ease-out ${
              isOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-90 translate-y-8 pointer-events-none"
            }`}
            style={{
              animation: isOpen
                ? "chatWindowExpandFromIcon 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                : !isTransitioning
                ? "none"
                : "chatWindowShrinkToIcon 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards",
            }}
          >
            <div
              className="w-full h-full bg-white/95 backdrop-blur-xl sm:rounded-2xl sm:shadow-2xl sm:border sm:border-white/50 flex flex-col overflow-hidden"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-white via-gray-100 to-gray-200 text-gray-800 p-4 sm:p-6 flex items-center gap-3 border-b border-white/30 overflow-hidden">
                <div className="relative z-10 p-2 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full animate-pulse">
                  <Bot size={16} className="sm:w-5 sm:h-5 text-gray-700" />
                </div>

                <div className="relative z-10 flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-lg text-gray-800 drop-shadow-sm flex items-center gap-2">
                    azrlwebdev
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

                {/* Header controls */}
                <div className="relative z-10 flex items-center gap-2">
                  {/* Close button */}
                  <button
                    onClick={toggleChat}
                    disabled={isTransitioning}
                    className="p-2 bg-gradient-to-br from-red-100 via-red-200 to-red-300 hover:from-red-200 hover:via-red-300 hover:to-red-400 text-red-700 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-lg group overflow-hidden"
                    aria-label="Tutup chat"
                  >
                    <X
                      size={16}
                      className="sm:w-5 sm:h-5 relative z-10 drop-shadow-sm group-hover:rotate-90 transition-transform duration-300"
                    />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                onWheel={handleWheel}
                onTouchMove={(e) => e.stopPropagation()}
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
                      onDeleteMessage={deleteMessage}
                    />
                  ))}

                  {/* NEW: Show thinking animation */}
                  {isThinking && <ThinkingMessage />}

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
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-6 border-t border-white/30 bg-gradient-to-r from-white/80 to-gray-100/80 backdrop-blur-sm sm:rounded-b-2xl">
                <div className="flex gap-2 sm:gap-3 items-center">
                  {/* Clear all chat button */}
                  {messages.length > 0 && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={clearAllMessages}
                        className="p-2.5 sm:p-3 bg-gradient-to-br from-red-100 via-red-200 to-red-300 hover:from-red-200 hover:via-red-300 hover:to-red-400 text-red-700 rounded-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-lg group overflow-hidden"
                        aria-label="Hapus semua chat"
                        title="Hapus semua percakapan"
                      >
                        <Trash2
                          size={14}
                          className="sm:w-4 sm:h-4 relative z-10 drop-shadow-sm group-hover:animate-bounce"
                        />
                      </button>
                    </div>
                  )}

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        isOnline
                          ? "Silahkan bertanya..."
                          : "Offline - coba lagi nanti"
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-inner transition-all duration-300 text-sm hover:shadow-md focus:shadow-lg"
                      disabled={isLoading || isThinking || !isOnline}
                      maxLength={1000}
                      style={{ minHeight: "44px" }}
                    />

                    {inputMessage.length > 800 && (
                      <div className="absolute bottom-1 right-10 sm:right-12 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded-lg shadow-sm animate-pulse">
                        {1000 - inputMessage.length}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={handleSendMessage}
                      disabled={
                        !inputMessage.trim() ||
                        isLoading ||
                        isThinking ||
                        !isOnline
                      }
                      className="relative group bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:via-gray-200 hover:to-gray-400 disabled:from-gray-200 disabled:to-gray-300 disabled:cursor-not-allowed text-gray-700 p-2.5 sm:p-3 rounded-xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-lg hover:shadow-xl overflow-hidden hover:scale-105 active:scale-95"
                      style={{
                        animation:
                          !inputMessage.trim() ||
                          isLoading ||
                          isThinking ||
                          !isOnline
                            ? "none"
                            : "pulseGlow 3s ease-in-out infinite",
                      }}
                      aria-label="Kirim pesan"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      <Send
                        size={14}
                        className={`sm:w-4 sm:h-4 relative z-10 drop-shadow-sm transition-transform duration-300 ${
                          isLoading || isThinking
                            ? "animate-spin"
                            : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        }`}
                      />

                      {inputMessage.trim() &&
                        !isLoading &&
                        !isThinking &&
                        isOnline && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-green-300/20 rounded-xl animate-pulse" />
                        )}
                    </button>
                  </div>
                </div>

                {/* Status Bar */}
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

                  <div className="flex items-center gap-2">
                    {(isLoading || isThinking) && (
                      <span className="flex items-center gap-1 animate-pulse">
                        <span className="text-xs text-blue-600">
                          {isThinking ? "AI thinking" : "AI typing"}
                        </span>
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

                    {messages.length > 1 && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <MessageSquare size={10} />
                        <span>{messages.length}</span>
                      </span>
                    )}
                  </div>
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
