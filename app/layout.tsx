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
  title: "FY2026-27 Board Pack | Talent Formula Group",
  description: "An original board narrative covering the four-year financial trajectory, growth engines, operating controls and decisions for Talent Formula Group.",
  metadataBase: new URL("https://dr-bo-kra.github.io/TF-Growth-Strategy/"),
  alternates: {
    canonical: "https://dr-bo-kra.github.io/TF-Growth-Strategy/",
  },
  openGraph: {
    title: "Talent Formula | FY2026-27 Board Strategy",
    description: "Talent Formula FY2026-27 board strategy, growth case and operating plan.",
    url: "https://dr-bo-kra.github.io/TF-Growth-Strategy/",
    siteName: "Talent Formula Growth Strategy",
    type: "website",
    images: [{ url: "https://dr-bo-kra.github.io/TF-Growth-Strategy/og.png", width: 1734, height: 907, alt: "Talent Formula FY2026-27 Board Strategy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talent Formula | FY2026-27 Board Strategy",
    description: "Talent Formula FY2026-27 board strategy, growth case and operating plan.",
    images: ["https://dr-bo-kra.github.io/TF-Growth-Strategy/og.png"],
  },
  icons: {
    icon: "/tf-logo-mark.png",
    shortcut: "/tf-logo-mark.png",
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
