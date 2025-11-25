import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getOnboardingProgress, getUserById } from "@/lib/data";
import { signOutUser } from "./actions";
import { WAITLIST_URL, BLOG_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

type SearchParams = {
  algorithm?: string;
};

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const [userResult, onboarding] = await Promise.all([
    userId ? getUserById(userId) : Promise.resolve(null),
    userId ? getOnboardingProgress(userId) : Promise.resolve(null),
  ]);
  const activeUser = userResult ?? null;
  const onboardingItems = activeUser && onboarding ? [
    {
      label: "Add a profile picture",
      href: `/${activeUser.handle}/edit`,
      done: onboarding.has_pfp,
    },
    {
      label: "Add a link to your profile",
      href: `/${activeUser.handle}/edit`,
      done: onboarding.has_link,
    },
    {
      label: "Add a display name",
      href: `/${activeUser.handle}/edit`,
      done: onboarding.has_display_name,
    },
    {
      label: "Update your status",
      href: `/${activeUser.handle}#post-form`,
      done: onboarding.has_status,
    },
    {
      label: "Post on someone else's profile",
      href: "/directory",
      done: onboarding.has_posted_elsewhere,
    },
  ] : [];
  const showOnboarding = onboardingItems.some((item) => !item.done);

  return (
    <main className="centered-vert">
      <Image className="seal" src="/stamp2.png" alt="Aleph" width={300} height={300} />
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {!activeUser ? (
        <>
          <Link href={WAITLIST_URL} target="_blank">
            <button className="emboss lifted">GET ON THE LIST</button>
          </Link>
          <Link href={BLOG_URL} target="_blank">
            <button className="emboss lifted">WRITING</button>
          </Link>
          <hr style={{ width: "100%" }}/>
          <p style={{ textAlign: "center", marginTop: "0" }}>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </p>
        </>
      ) : (
        <>
          <p className="home-greeting emboss">
            Hello {activeUser.name?.trim() || `@${activeUser.handle}`}
          </p>
          {showOnboarding ? (
            <section className="emboss lifted" style={{ padding: "1rem" }}>
              <p className="deboss" style={{ marginTop: 0, marginBottom: "0.5rem" }}>Onboarding checklist</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {onboardingItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="emboss"
                      style={{
                        textDecoration: item.done ? "line-through" : "none",
                        color: item.done ? "var(--color-text-muted)" : undefined,
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <Link href={`/${activeUser.handle}`}><button className="emboss lifted">View Page</button></Link>
          <Link href={`/${activeUser.handle}/edit`}><button className="emboss lifted">Edit Page</button></Link>
          <form action={signOutUser}>
            <button className="emboss lifted" type="submit">Sign Out</button>
          </form>
          <Link href="/directory"><button className="emboss lifted">Explore</button></Link>
          <hr style={{ width: "100%" }}/>
          <Link href={BLOG_URL} target="_blank">
            <button className="emboss lifted">Writing</button>
          </Link>
        </>
      )}

      </section>

    </main>
  );
}
