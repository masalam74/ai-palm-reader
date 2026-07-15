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
  title: "AI Palm Reader - Free Online Palm Reading | Discover Your Palm's Secrets",
  description:
    "Get a free AI-powered palm reading in seconds. Upload a photo of your palm and discover what your heart line, head line, life line, and fate line reveal about your personality, love life, and destiny.",
  keywords: [
    "palm reading online free",
    "AI palm reader",
    "read my palm",
    "palmistry",
    "chiromancy",
    "palm line analysis",
    "heart line meaning",
    "head line meaning",
    "life line reading",
    "fate line palmistry",
    "dermatoglyphics",
    "hand reading",
    "palm analysis",
    "free palm reading",
    "online fortune telling",
  ],
  authors: [{ name: "AI Palm Reader" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AI Palm Reader - Free Online Palm Reading",
    description:
      "Upload your palm photo and get an instant AI-powered reading. Discover your element type, personality traits, and what your palm lines reveal.",
    siteName: "AI Palm Reader",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Palm Reader - Free Online Palm Reading",
    description:
      "Upload your palm photo and get an instant AI-powered reading. Discover what your palm lines reveal.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for Google rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Palm Reader",
  description:
    "Free AI-powered palm reading. Upload a photo of your palm and discover what your lines reveal about your personality and destiny.",
  url: "https://aipalmreader.com",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI-powered palm line analysis",
    "Heart line interpretation",
    "Head line interpretation",
    "Life line interpretation",
    "Fate line analysis",
    "Hand shape classification",
    "Element type identification",
    "Mounts analysis",
    "Scientific dermatoglyphic perspective",
    "Camera capture support",
    "Shareable result cards",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}
      >
        {children}
      </body>
    </html>
  );
}