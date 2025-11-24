import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getUserById } from "@/lib/data";
import { signOutUser } from "./actions";
import { JoinForm } from "@/components/JoinForm";
import { WAITLIST_URL, BLOG_URL } from "@/lib/constants";

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
      {/* <header>
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

        </nav>
      </header> */}

      <Image className="seal" src="/stamp.png" alt="Aleph" width={300} height={200} />
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {!activeUser ? (
        <>
          <Link href={WAITLIST_URL} target="_blank">
            <button className="emboss lifted">GET ON THE LIST</button>
          </Link>
          <Link href={BLOG_URL} target="_blank">
            <button className="emboss lifted">WRITING</button>
          </Link>
          {/* TODO move join form */}
          {/* <JoinForm /> */}
          <p>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </p>
        </>
      ) : (
        <>
          <p>Welcome back, {activeUser.name?.trim() || `@${activeUser.handle}`}</p>
          <Link href={`/${activeUser.handle}`}><button className="emboss lifted">VIEW PAGE</button></Link>
          <Link href={`/${activeUser.handle}/edit`}><button className="emboss lifted">EDIT PAGE</button></Link>
          <form action={signOutUser}>
            <button className="emboss lifted" type="submit">SIGN OUT</button>
          </form>
          <hr/>
          <Link href={BLOG_URL} target="_blank">
            <button className="emboss lifted">WRITING</button>
          </Link>
        </>
      )}

      </section>

    </main>
  );
}
