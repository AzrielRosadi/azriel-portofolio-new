// Simple text formatter - NO HTML TAGS
export const cleanTextResponse = (rawResponse) => {
  if (!rawResponse || typeof rawResponse !== "string") {
    return rawResponse;
  }

  let cleanedResponse = rawResponse;

  // Remove any HTML tags that might be in the response
  cleanedResponse = cleanedResponse.replace(/<[^>]*>/g, "");

  // Clean up excessive whitespace
  cleanedResponse = cleanedResponse.replace(/\n{3,}/g, "\n\n");
  cleanedResponse = cleanedResponse.replace(/\s{3,}/g, " ");

  // Keep basic formatting characters
  cleanedResponse = cleanedResponse.trim();

  return cleanedResponse;
};
