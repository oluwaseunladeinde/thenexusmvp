// lib/utils/domain/extractDomainFromUrl.ts
export function extractDomainFromUrl(url: string): string | null {
    try {
        const cleaned = url.startsWith("http")
            ? url
            : `https://${url}`;

        const { hostname } = new URL(cleaned);

        return hostname.replace(/^www\./, "").toLowerCase();
    } catch {
        return null;
    }
}

export function extractDomainFromEmail(email: string): string | null {
    if (!email.includes("@")) return null;
    return email.split("@")[1].toLowerCase();
}

export function extractRootDomain(domain: string): string {
    const parts = domain.toLowerCase().split(".");
    if (parts.length <= 2) return domain;

    // Keep last two segments: company.com, org.ng, etc.
    return parts.slice(parts.length - 2).join(".");
}

export function doDomainsMatch(domainA: string, domainB: string): boolean {
    const rootA = extractRootDomain(domainA);
    const rootB = extractRootDomain(domainB);

    return rootA === rootB;
}


