/**
 * Formats a date into a short "time ago" string like "2m", "1h", "3d".
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted time ago string
 */
export const formatTimeAgo = (date) => {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return `${Math.max(0, diffInSeconds)}s`;
  }

  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  // Default to weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w`;
};
