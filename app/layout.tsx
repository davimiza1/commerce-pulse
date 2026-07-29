import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CommercePulse — E-commerce analytics",
  description: "A modern commerce analytics dashboard for revenue, orders, products, customers, and inventory.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "CommercePulse — Know your store. Grow with clarity.",
    description: "A premium e-commerce analytics dashboard for modern store owners.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CommercePulse analytics dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CommercePulse — Know your store. Grow with clarity.",
    description: "A premium e-commerce analytics dashboard for modern store owners.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
