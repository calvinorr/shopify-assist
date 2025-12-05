import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Herbarium Content Studio",
  description: "Content automation for Herbarium Dyeworks - AI-powered blog posts, Instagram captions, and product marketing from your Shopify data.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Herbarium Content Studio",
    description: "AI-powered content automation for artisan e-commerce",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
