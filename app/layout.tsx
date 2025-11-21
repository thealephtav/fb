import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T H E  A L E P H",
  description: "An exclusive corner of the web",
  openGraph: {
    title: "T H E  A L E P H",
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
      <body className="antialiased">
        <div>{children}</div>
      </body>
    </html>
  );
}
