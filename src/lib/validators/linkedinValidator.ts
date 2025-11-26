

/**
 * 1. Validates a string to ensure it follows a standard LinkedIn profile URL format.
 * Checks for:
 * - Starts with http(s)://
 * - Domain is linkedin.com
 * - Path includes /in/ (for individual profiles)
 * - Includes a username/identifier.
 * @param {string} url The URL to validate.
 * @returns {boolean} True if the format is valid, false otherwise.
 */
export const isValidLinkedInUrl = (url: string): boolean => {
    if (!url) {
        return false;
    }
    // Regex for standard LinkedIn profile URLs:
    // Allows 'linkedin.com/in/' or 'www.linkedin.com/in/'
    const regex = /^https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
    return regex.test(url);
}