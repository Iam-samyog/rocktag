// src/app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono, Poppins, Roboto } from "next/font/google";
import GoogleMapsLoader from "./GoogleMapsLoader";

// ── FONTS ─────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"], // Use only bold for headings
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"], // Regular + medium
});

// ── METADATA ───────────────────────────────────
export const metadata = {
  title: "UTA CatMap by ACM",
  description: "Generated with love by ACM",
};

// ── LAYOUT ─────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${poppins.variable}
          ${roboto.variable}
          font-body          /* ← DEFAULT: Roboto */
          antialiased
        `}
      >
        {children}
        <GoogleMapsLoader />
      </body>
    </html>
  );
}