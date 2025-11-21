import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getFollowersByHandle, getUserProfileByHandle } from "@/lib/data";

export default async function FollowersPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  const viewerId = session?.user?.id ?? null;
  const handle = resolvedParams.handle.trim().toLowerCase();
  const profile = await getUserProfileByHandle(handle, viewerId);
  if (!profile) {
    notFound();
  }
  const followers = await getFollowersByHandle(handle);
  const profileDisplayName = profile.name?.trim() || `@${profile.handle}`;

  return (
    <main>
      <h1>Followers of {profileDisplayName}</h1>
      <section>
        <h2>Profile</h2>
        {profile.pfp ? (
          <Image src={profile.pfp} alt={`@${profile.handle ?? "user"}`} width={120} height={120} />
        ) : (
          <Image src="/default-pfp.png" alt="Default profile" width={120} height={120} />
        )}
        <p>{profile.name ?? ""}</p>
      </section>
      <section>
        <h2>Followers</h2>
        {followers.length === 0 ? (
          <p>No followers yet.</p>
        ) : (
          <ul>
            {followers.map((user) => (
              <li key={user.id}>
                {user.pfp ? (
                  <Image src={user.pfp} alt={`@${user.handle ?? "user"}`} width={48} height={48} />
                ) : (
                  <Image src="/default-pfp.png" alt="Default profile" width={48} height={48} />
                )}
                <Link href={`/${user.handle}`}>
                  {user.name?.trim() || `@${user.handle ?? "user"}`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
