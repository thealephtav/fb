import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { auth } from "@/auth";
import { getUserById } from "@/lib/data";
import { signOutUser } from "./actions";

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
  const session = await auth();
  const currentUser = session?.user?.id ? await getUserById(session.user.id) : null;

  return (
    <html lang="en">
      <body className="antialiased">
        <header>
          <nav className="navbar">
            {currentUser && (
              <div>
                {currentUser.pfp ? (
                  <Image
                    src={currentUser.pfp}
                    alt="Profile"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span>👤</span>
                )}
                {currentUser.handle ? (
                  <Link href={`/u/${currentUser.handle}`}>@{currentUser.handle}</Link>
                ) : null}
              </div>
            )}
            <Link href="/">THE ALEPH</Link>
            {currentUser && (
              <form action={signOutUser}>
                <button type="submit">Sign Out</button>
              </form>
            )}
          </nav>
        </header>
        <div>{children}</div>
      </body>
    </html>
  );
}
