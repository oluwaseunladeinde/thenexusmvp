export async function checkUrlAccessible(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, {
            method: "HEAD",
            redirect: "follow",
        });

        return response.ok;
    } catch (err) {
        return false;
    }
}

/**
 * 2. Checks the accessibility of a URL using an efficient HTTP HEAD request.
 * @param {string} url The URL to check.
 * @returns {Promise<boolean>} Resolves to true if the URL returns a 2xx or 3xx status, false otherwise.
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
    try {
        console.log(`[HTTP] Attempting HEAD request for: ${url}`);
        // Using 'no-cors' mode is often necessary in certain browser/iframe environments,
        // but for a Node environment, omitting it is standard. We assume a permissive fetch environment here.
        const response = await fetch(url, {
            method: 'HEAD',
            // Increase timeout for slow connections (default is often too long, but we keep it simple here)
        });

        const status = response.status;
        console.log(`[HTTP] Response status: ${status}`);

        // A 2xx (Success) or 3xx (Redirection) status means the URL is accessible/exists.
        return status >= 200 && status < 400;

    } catch (error) {
        console.error(`[HTTP ERROR] Failed to access URL: ${url}`, error);
        return false;
    }
}