import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getExploreProfiles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const profiles = await getExploreProfiles();

  return (
    <main>
      <h1 className="deboss" style={{ textAlign: "center" }}>Directory</h1>
      <ul className="explore-list">
        {profiles.map((profile) => (
          <li key={profile.id} className="explore-item">
            <div className="explore-card">
              <Link href={`/${profile.handle ?? ""}`} className="explore-avatar" aria-label={`View @${profile.handle ?? "user"}`}>
                <Image
                  src={profile.pfp ?? "/default-pfp.png"}
                  alt={`@${profile.handle ?? "user"} profile picture`}
                  width={64}
                  height={64}
                />
              </Link>
              <div className="explore-meta">
                <Link href={`/${profile.handle ?? ""}`} className="explore-handle emboss">
                  {profile.name?.trim() || `@${profile.handle}`}
                </Link>
                <p className="explore-status">
                  {profile.latest_status ?? "No status yet."}
                </p>
                {profile.latest_status_at ? (
                  <small className="explore-status-at">
                    Updated{" "}
                    {new Date(profile.latest_status_at).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </small>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
