import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  metadataBase: new URL("https://snapost-ai.breathy.in"),
  title: {
    default:
      "SnapPost AI — Turn Any Screenshot Into Scroll-Stopping Social Content",
    template: "%s | SnapPost AI",
  },
  description:
    "AI-powered Screenshot-to-Social-Post Generator for founders, SaaS teams, developers, and marketers. Analyze screenshots with AI Vision, generate multi-platform designs & captions, edit on a live canvas, and export in Ultra-HD.",
  alternates: {
    canonical: "https://snapost-ai.breathy.in",
  },
  openGraph: {
    type: "website",
    url: "https://snapost-ai.breathy.in",
    siteName: "SnapPost AI",
    title:
      "SnapPost AI — Turn Any Screenshot Into Scroll-Stopping Social Content",
    description:
      "Transform raw product screenshots into agency-grade LinkedIn, X, Instagram, and Pinterest social posts with AI Vision.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#0B0D14] text-slate-100 antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
