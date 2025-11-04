import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Manrope } from "next/font/google";
import "./globals.css";
import { UserProfileProvider } from '@/contexts/UserProfileContext';
// import { Toaster } from "@/components/ui/sonner";

const manRope = Manrope({
  variable: "--font-manrope-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'theNexus - Turn Conversations Into Careers',
  description: 'Connect with decision-makers through trusted, private introductions. theNexus helps professionals and HR leaders build meaningful career connections.',
  icons: {
    icon: "/favicon.png",           // Default
    shortcut: "/favicon-16x16.png", // Optional
    apple: "/apple-touch-icon.png", // For iOS
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#2E8B57', // theNexus green
          colorBackground: '#ffffff',
          colorText: '#0A2540', // theNexus navy
          colorTextSecondary: '#666666',
          colorInputBackground: '#ffffff',
          colorInputText: '#0A2540',
          borderRadius: '6px',
          fontFamily: 'Manrope, -apple-system, system-ui, sans-serif',
        },
        elements: {
          formButtonPrimary:
            'bg-[#2E8B57] hover:bg-[#1F5F3F] text-white font-semibold',
          formButtonReset:
            'bg-transparent border-2 border-[#0A2540] text-[#0A2540] hover:bg-[#0A2540] hover:text-white',
          card: 'shadow-lg',
          headerTitle: 'text-[#0A2540] text-2xl font-bold',
          headerSubtitle: 'text-[#666666]',
          socialButtonsBlockButton:
            'border border-gray-300 hover:bg-gray-50',
          formFieldLabel: 'text-[#0A2540] font-medium',
          formFieldInput:
            'border-gray-300 focus:border-[#2E8B57] focus:ring-[#2E8B57]',
          footerActionLink: 'text-[#2E8B57] hover:text-[#1F5F3F]',
        },
      }}
    >
      <html lang="en">
        <body
          className={`${manRope.variable} antialiased`}
        >
          <UserProfileProvider>
            {children}
          </UserProfileProvider>
          {/* <Toaster position="top-right" richColors /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
