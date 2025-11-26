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
      <Image className="seal" src="/stamp4.png" alt="Aleph" width={300} height={300} />
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {!activeUser ? (
        <>
          <Link href={WAITLIST_URL} target="_blank">
            <button className="btn lifted btnLg">Get on the List</button>
          </Link>
          <Link href={BLOG_URL} target="_blank">
            <button className="btn lifted btnLg">Writing</button>
          </Link>
          <hr style={{ width: "100%" }}/>
          <p style={{ textAlign: "center", marginTop: "0" }}>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </p>
        </>
      ) : (
        <>
          <p className="centered emboss" style={{ margin: "0" }}>
            Hello {activeUser.name?.trim() || `@${activeUser.handle}`}
          </p>
          {showOnboarding ? (
            <section
              className="emboss lifted"
              style={{
                padding: "1.5rem 1rem 1rem 2.2rem",
                background: "repeating-linear-gradient(to bottom, var(--color-warning), var(--color-warning) 28px, #fbeec0 28px, #fbeec0 30px)",
                borderRadius: "4px",
                border: "2px solid #e4bf64",
                position: "relative",
              }}
            >
              {/* Simulate notebook margin */}
              <div
                style={{
                  position: "absolute",
                  left: "1.15rem",
                  top: "0.9rem",
                  width: "2px",
                  height: "calc(100% - 1.8rem)",
                  background: "rgba(180, 80, 80, 0.32)",
                  borderRadius: "3px",
                }}
              />
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "0.5rem",
                  color: "#5b462c",
                  textShadow: "none",
                }}
              >
                Onboarding checklist
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {onboardingItems.map((item, idx) => (
                  <li
                    key={item.label}
                    style={{
                      borderBottom: idx < onboardingItems.length - 1 ? "1.5px dashed #ceb263" : "none",
                    }}
                  >
                    <Link
                      href={item.href}
                      style={{
                        textDecoration: item.done
                          ? "line-through #adadad"
                          : "none",
                        textShadow: item.done
                          ? "none"
                          : "1px 1px 0 #fffbe7",
                        cursor: item.done ? "default" : "pointer",
                        color: item.done ? "var(--color-text-muted)" : "var(--color-link)",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <Link href={`/${activeUser.handle}`}><button className="btn lifted btnLg">View Page</button></Link>
          <Link href={`/${activeUser.handle}/edit`}><button className="btn lifted btnLg">Edit Page</button></Link>
          <form action={signOutUser}>
            <button className="btn lifted btnLg" type="submit">Sign Out</button>
          </form>
          <Link href="/directory"><button className="btn lifted btnLg">Explore</button></Link>
          <hr style={{ width: "100%" }}/>
          <Link href={BLOG_URL} target="_blank">
            <button className="btn lifted btnLg">Writing</button>
          </Link>
        </>
      )}

      </section>

    </main>
  );
}
