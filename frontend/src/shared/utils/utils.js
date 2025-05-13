/**
 * Formats a date into a time string (HH:MM format)
 * Used for displaying message timestamps in the chat interface
 *
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time string in 24-hour format
 */
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
