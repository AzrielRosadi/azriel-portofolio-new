import React from "react";
import { Bot, User, Mail, Globe } from "lucide-react";

const ChatMessage = ({ message }) => {
  const formatTime = (date) =>
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Function untuk parse text dengan bold dan links
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
      } mb-4 animate-fade-in px-2 sm:px-0`}
    >
      <div
        className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-3 rounded-2xl shadow-lg ${
          message.sender === "user"
            ? "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white border border-gray-500/30"
            : "bg-gradient-to-br from-white/90 via-gray-50/90 to-gray-100/90 text-gray-800 border border-white/50 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-sm">
            {message.sender === "bot" ? (
              <Bot size={12} className="sm:w-3.5 sm:h-3.5 text-gray-600" />
            ) : (
              <User size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed font-medium break-words">
              {renderFormattedText(message.text)}
            </div>
            <p
              className={`text-xs mt-2 font-light ${
                message.sender === "user" ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatMessage;
