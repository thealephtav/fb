import type { Metadata } from "next";
import "./tokens.css";
import "./globals.css";
import "./components.css";
import { Analytics } from "@vercel/analytics/react";
import { Cormorant_Garamond, Crimson_Text, Montserrat } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant-garamond'
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat'
})

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson-text'
})
export const metadata: Metadata = {
  title: "꧁ ALEPH ꧂",
  description: "An exclusive corner of the web",
  openGraph: {
    title: "꧁ ALEPH ꧂",
    description: "A private space for artists",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${cormorantGaramond.variable} ${montserrat.variable} ${crimsonText.variable}`}
        suppressHydrationWarning
      >
        <div>{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
