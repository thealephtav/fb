import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getFollowingByHandle, getUserProfileByHandle } from "@/lib/data";

export default async function FollowingPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  const viewerId = session?.user?.id ?? null;
  const handle = resolvedParams.handle.trim().toLowerCase();
  const profile = await getUserProfileByHandle(handle, viewerId);
  if (!profile) {
    notFound();
  }
  const following = await getFollowingByHandle(handle);
  const profileDisplayName = profile.name?.trim() || `@${profile.handle}`;

  return (
    <main>
      <h1>{profileDisplayName} is following</h1>
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
        <h2>Following</h2>
        {following.length === 0 ? (
          <p>Not following anyone yet.</p>
        ) : (
          <ul>
            {following.map((user) => (
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
