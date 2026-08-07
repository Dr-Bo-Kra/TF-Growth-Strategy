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
  title: "TF Growth Strategy | Talent Formula",
  description: "TF Growth Strategy: four-year financial trajectory, growth engines, operating controls and board decisions for Talent Formula Group.",
  metadataBase: new URL("https://dr-bo-kra.github.io/TF-Growth-Strategy"),
  openGraph: {
    title: "TF Growth Strategy",
    description: "Scale the platform. Protect the downside.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "TF Growth Strategy" }],
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
