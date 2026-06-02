import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LiquidBackground from "@/components/LiquidBackground";
import CursorBlob from "@/components/CursorBlob";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammad Umair Alam — AI Developer",
  description:
    "Computer Vision · LLMs · Medical Imaging. Portfolio of Muhammad Umair Alam, AI Developer at ZIGRON.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Muhammad Umair Alam — AI Developer",
    description:
      "Computer Vision · LLMs · Medical Imaging. Featuring an interactive dental segmentation demo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <LiquidBackground />
        <CursorBlob />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
