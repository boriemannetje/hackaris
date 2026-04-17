import type { Metadata } from "next";
import localFont from "next/font/local";
import { VT323 } from "next/font/google";
import "./globals.css";

const shelfLife = localFont({
  src: "./fonts/Shelf Life.ttf",
  display: "swap",
  variable: "--font-shelf-life",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
});

const siteUrl = "https://hackaris.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
  title: {
    default: "Hackaris - Paris Indie Makers Coworking",
    template: "%s | Hackaris",
  },
  description:
    "Hackaris is a community-run group of indie makers, coders, designers, and hardware hackers building independent projects together in Paris.",
  keywords: [
    "Hackaris",
    "Paris hackathon",
    "Paris coworking",
    "indie makers",
    "startup community",
    "builders meetup",
    "HACKA network",
  ],
  authors: [{ name: "Hackaris Community", url: siteUrl }],
  creator: "Hackaris",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Hackaris",
    title: "Hackaris - Paris Indie Makers Coworking",
    description:
      "A weekly Thursday community for indie makers, coders, designers, and hardware hackers building independent projects in Paris.",
    locale: "en",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Hackaris in Paris",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackaris - Paris Indie Makers Coworking",
    description:
      "Join Hackaris every Thursday in Paris for intros, deep work, demos, and apéro.",
    images: ["/image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hackaris",
  url: siteUrl,
  description:
    "A community-run group of indie makers, coders, designers, and hardware hackers who meet weekly in Paris.",
  foundingDate: "2026",
  sameAs: ["https://hacka.network"],
  knowsAbout: [
    "indie building",
    "startup product development",
    "coding",
    "design",
    "hardware hacking",
    "coworking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme-index="3">
      <body className={`${vt323.className} ${shelfLife.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
