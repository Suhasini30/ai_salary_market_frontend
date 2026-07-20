/**
 * Format an ISO timestamp string into a localized time string (HH:MM).
 * @param {string} isoString - The ISO timestamp string
 * @returns {string} Formatted time string, e.g., "10:30 PM"
 */
export function formatTime(isoString) {
  if (!isoString) return "Just now";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "Just now";
  }
}
