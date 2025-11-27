import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getExploreProfiles, getOnboardingProgress, getUserById } from "@/lib/data";
import { signOutUser, createPost } from "./actions";
import { ProfileRow } from "@/components/ProfileRow";
import { CreatePostForm } from "@/components/CreatePostForm";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { redirect } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { ProfileHero } from "@/components/ProfileHero";

export const dynamic = "force-dynamic";

type SearchParams = {
  algorithm?: string;
};

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  if (!userId) {
    redirect("/welcome");
  }
  const [userResult, onboarding, exploreProfiles] = await Promise.all([
    getUserById(userId),
    getOnboardingProgress(userId),
    getExploreProfiles(userId),
  ]);
  const activeUser = userResult ?? null;
  // activeUser is expected for signed-in users; if missing, redirect to welcome
  if (!activeUser) {
    redirect("/welcome");
  }
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
  ] : [];
  const showOnboarding = onboardingItems.some((item) => !item.done);

  return (
    <main>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "var(--size-sm)",
        }}
      >
        <NavBar>
          <form action={signOutUser} style={{ marginRight: "auto" }}>
            <button
              className="emboss badge"
              type="submit"
              style={{
                border: "none",
                color: "var(--color-link)",
                fontFamily: "var(--font-display)",
              }}
            >
              ✦ Sign Out
            </button>
          </form>
          <Link
            href={`/${activeUser.handle}/edit`}
            style={{ marginLeft: "auto" }}
          >
            <span className="emboss badge">✎</span>
          </Link>
        </NavBar>
        <ProfileHero
          profileHandle={activeUser.handle}
          profileName={activeUser.name ?? ""}
          profilePfp={activeUser.pfp}
          statusText={activeUser.latest_status ?? "No status yet."}
          statusUpdatedAt={
            activeUser.latest_status_at
              ? new Date(activeUser.latest_status_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
              : null
          }
        />
        <CreatePostForm canPost action={createPost} profileHandle={activeUser.handle} placeholderText="Update your status" />
        {showOnboarding ? <OnboardingChecklist items={onboardingItems} /> : null}
        <hr style={{ width: "100%" }}/>
        
        {exploreProfiles.length > 0 ? (
          <section style={{ width: "100%" }}>
            <h2 className="deboss" style={{ textAlign: "center", marginBottom: "var(--space-sm)" }}>
              Members
            </h2>
            <ul className="explore-list">
              {exploreProfiles.map((profile) => (
                <li key={profile.id} className="explore-item">
                  <div className="explore-card">
                    <ProfileRow
                      href={`/${profile.handle}`}
                      name={profile.name}
                      handle={profile.handle}
                      pfp={profile.pfp}
                      body={profile.latest_status ?? "No status yet."}
                      subText={
                        profile.latest_status_at
                          ? `Updated ${new Date(profile.latest_status_at).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}`
                          : profile.latest_status ?? ""
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </section>
    </main>
  );
}
