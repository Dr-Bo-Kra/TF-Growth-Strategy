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
  metadataBase: new URL("https://talent-formula-board-fy2627.kranthi12.chatgpt.site"),
  openGraph: {
    title: "Talent Formula | FY2026-27 Board Plan",
    description: "Scale the platform. Protect the downside.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Talent Formula FY2026-27 Board Plan" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: "/tf-logo-mark-v2.png",
    shortcut: "/tf-logo-mark-v2.png",
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
