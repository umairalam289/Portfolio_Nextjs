import type { Metadata } from "next";
import { Spectral, Hanken_Grotesk, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";
import LiquidBackground from "@/components/LiquidBackground";
import Navbar from "@/components/Navbar";
import FX from "@/components/FX";

// Serif display + humanist sans + technical mono — a real contrast axis, and
// off the saturated AI-portfolio reflex set.
const display = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Spline_Sans_Mono({
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
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <LiquidBackground />
        <FX />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
