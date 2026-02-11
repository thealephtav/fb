import type { Metadata } from "next";
import "./tokens.css";
import "./globals.css";
import "./components.css";
import { Analytics } from "@vercel/analytics/react";

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
      <body className="antialiased" suppressHydrationWarning>
        <div>{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
