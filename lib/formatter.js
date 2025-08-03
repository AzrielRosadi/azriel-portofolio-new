// lib/formatter.js - Text Formatter for Clean Responses
export const cleanTextResponse = (rawResponse) => {
  if (!rawResponse || typeof rawResponse !== "string") {
    return rawResponse || "";
  }

  let cleanedResponse = rawResponse;

  // Remove HTML tags that might be in the response
  cleanedResponse = cleanedResponse.replace(/<[^>]*>/g, "");

  // Clean up HTML entities
  cleanedResponse = cleanedResponse
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Clean up excessive whitespace
  cleanedResponse = cleanedResponse.replace(/\n{3,}/g, "\n\n");
  cleanedResponse = cleanedResponse.replace(/\s{3,}/g, " ");

  // Remove markdown-style formatting that might cause issues
  cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, "$1"); // Bold
  cleanedResponse = cleanedResponse.replace(/\*(.*?)\*/g, "$1"); // Italic
  cleanedResponse = cleanedResponse.replace(/`(.*?)`/g, "$1"); // Code

  // Keep basic formatting characters and emojis
  cleanedResponse = cleanedResponse.trim();

  return cleanedResponse;
};
