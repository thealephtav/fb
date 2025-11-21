import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getUserById } from "@/lib/data";
import { signOutUser } from "./actions";
import { JoinForm } from "@/components/JoinForm";

export const dynamic = "force-dynamic";

type SearchParams = {
  algorithm?: string;
};

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const [userResult] = await Promise.all([
    userId ? getUserById(userId) : Promise.resolve(null),
  ]);
  const activeUser = userResult?.handle ? userResult : null;

  return (
    <main>
      <header>
        <nav className="navbar">
          {activeUser && (
            <div>
              {activeUser.pfp ? (
                <Image
                  src={activeUser.pfp}
                  alt="Profile"
                  width={40}
                  height={40}
                />
              ) : (
                <Image src="/default-pfp.png" alt="Default profile" width={40} height={40} />
              )}
              <Link href={`/${activeUser.handle}`}>
                {activeUser.name?.trim() || `@${activeUser.handle}`}
              </Link>
            </div>
          )}
          <Link href="/">THE ALEPH</Link>
          {activeUser && (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Link href={`/${activeUser.handle}/edit`}>
                <button>Edit Profile</button>
              </Link>
              <form action={signOutUser}>
                <button type="submit">Sign Out</button>
              </form>
            </div>
          )}
        </nav>
      </header>

      {!activeUser ? (
        <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <JoinForm />
          <p>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </p>
        </section>
      ) : (
        <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h1>Welcome back, {activeUser.name?.trim() || `@${activeUser.handle}`}</h1>
          <p>
            Head to your profile to update your status:{" "}
            <Link href={`/${activeUser.handle}`}>View your page</Link>
          </p>
        </section>
      )}
    </main>
  );
}
