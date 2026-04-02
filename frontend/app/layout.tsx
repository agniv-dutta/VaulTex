import type { Metadata } from "next";
import { IBM_Plex_Mono, Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const displayFont = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dataFont = Share_Tech_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "FinLedger",
  description: "Personal finance dashboard (Y2K retro-tech UI).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} ${dataFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col scanlines">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
