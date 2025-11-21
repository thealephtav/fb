import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPostsByHandle, getUserProfileByHandle, getProfileLinksByUserId } from "@/lib/data";
import { followUser, unfollowUser, createPost } from "@/app/actions";
import { PostList } from "@/components/PostList";
import { CreatePostForm } from "@/components/CreatePostForm";

export default async function UserProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  const viewerId = session?.user?.id ?? null;
  const handleParam = typeof resolvedParams.handle === "string" ? resolvedParams.handle : "";
  const normalizedHandle = handleParam.trim().toLowerCase();
  const [profile, posts] = await Promise.all([
    getUserProfileByHandle(normalizedHandle, viewerId),
    getPostsByHandle(normalizedHandle),
  ]);

  if (!profile) {
    notFound();
  }

  const [profileLinks] = await Promise.all([getProfileLinksByUserId(profile.id)]);

  const displayName = profile.name?.trim() ? profile.name.trim() : `@${profile.handle}`;
  const normalizeLink = (link: string) => {
    const trimmed = link.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };
  const normalizedProfileLinks = profileLinks
    .map((link) => {
      const href = normalizeLink(link.uri);
      if (!href) return null;
      const label = link.label?.trim() || link.uri;
      return { ...link, href, label };
    })
    .filter((link): link is { id: number; href: string; label: string } => !!link);
  const isOwner = viewerId === profile.id;

  return (
    <main className="feed">
      <article className="profile-card">
        <div className="profile-hero">
          <div className="profile-avatar">
            {profile.pfp ? (
              <Image
                src={profile.pfp}
                alt={`@${profile.handle ?? "user"} profile picture`}
                width={96}
                height={96}
              />
            ) : (
              <Image src="/default-pfp.png" alt="Default profile" width={96} height={96} />
            )}
          </div>
          <h1 className="profile-handle">{displayName}</h1>
          {profile.bio ? (
            <p className="profile-bio">
              <i>{profile.bio}</i>
            </p>
          ) : null}
          {normalizedProfileLinks.length > 0 ? (
            <ul className="profile-links">
              {normalizedProfileLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <p className="profile-stats">
          <Link href={`/${profile.handle}/followers`}>
            <strong>{profile.follower_count}</strong> Followers
          </Link>{" "}
          ·{" "}
          <Link href={`/${profile.handle}/following`}>
            <strong>{profile.following_count}</strong> Following
          </Link>
        </p>
      </article>
      {isOwner ? (
        <Link href={`/${profile.handle}/edit`}>Edit Profile</Link>
      ) : viewerId ? (
        <form action={profile.is_following ? unfollowUser : followUser}>
          <input type="hidden" name="targetUserId" value={profile.id} />
          <input type="hidden" name="targetHandle" value={profile.handle ?? ""} />
          <button type="submit">{profile.is_following ? "Unfollow" : "Follow"}</button>
        </form>
      ) : (
        <Link href="/welcome">Join to follow</Link>
      )}
      <CreatePostForm
        canPost={!!viewerId}
        action={createPost}
        profileHandle={profile.handle ?? undefined}
        disabledMessage="Join to post on this profile."
      />
      <section>
        <h2>Wall</h2>
        <PostList posts={posts} />
      </section>
    </main>
  );
}
