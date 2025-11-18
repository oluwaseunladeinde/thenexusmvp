import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
}
export function deleteCookie(name: string, path: string = '/', domain?: string) {
  if (typeof document === 'undefined') return
  const domainStr = domain ? `; domain=${domain}` : ''
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domainStr}`
}

export function randomString(length: number = 10) {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charactersLength
    result += characters.charAt(randomIndex)
  }
  return result
}

export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  return `${timestamp}-${random}`;
};

// Define your enum
export enum CompanySize {
  SMALL_1_10 = 'SMALL_1_10',
  MEDIUM_11_50 = 'MEDIUM_11_50',
  LARGE_51_200 = 'LARGE_51_200',
  XLARGE_201_500 = 'XLARGE_201_500',
  ENTERPRISE_500_PLUS = 'ENTERPRISE_500_PLUS',
}

// Utility function to get human-readable label
export function getCompanySizeLabel(size: CompanySize): string {
  const labels: Record<CompanySize, string> = {
    [CompanySize.SMALL_1_10]: 'Small (1 - 10)',
    [CompanySize.MEDIUM_11_50]: 'Medium (11 - 50)',
    [CompanySize.LARGE_51_200]: 'Large (51 - 200)',
    [CompanySize.XLARGE_201_500]: 'X-Large (201 - 500)',
    [CompanySize.ENTERPRISE_500_PLUS]: 'Enterprise (500+)',
  };

  return labels[size] ?? 'Unknown';
}

export function capitalize(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
