import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "SnapPost AI — Turn Any Screenshot Into Scroll-Stopping Social Content",
  description:
    "AI-powered Screenshot-to-Social-Post Generator for founders, SaaS teams, developers, and marketers. Analyze screenshots with AI Vision, generate multi-platform designs & captions, edit on a live canvas, and export in Ultra-HD.",
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
