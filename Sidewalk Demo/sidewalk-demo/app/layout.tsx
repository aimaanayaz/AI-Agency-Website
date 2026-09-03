import type { Metadata, Viewport } from "next";
import { Oswald, DM_Sans } from "next/font/google";
import "./globals.css";
import { brand } from "@/data/brand";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} · Order at your table`,
  description: `${brand.tagline}. Scan the code on your table, order, and we bring it over.`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f1e4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${dmSans.variable} antialiased`}>
      <body>
        {/* Phone-first: constrain to a phone column even on desktop, where it
            reads as a printed card standing on the café table. */}
        <div className="app-column relative mx-auto min-h-dvh max-w-md">{children}</div>
      </body>
    </html>
  );
}
