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
  const normalizedProfileLinks = profileLinks
    .map((link) => {
      const label = link.label?.trim() || link.uri;
      const href = /^https?:\/\//i.test(link.uri) ? link.uri : `https://${link.uri}`;
      return { ...link, href, label };
    })
    .filter((link): link is { id: number; href: string; label: string } => !!link.href && !!link.label);
  const statusPost = posts.find(
    (post) => post.author_handle === profile.handle && post.profile_handle === profile.handle,
  );
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
          {statusPost ? (
            <div className="profile-status">
              <p className="profile-status-body">{statusPost.body}</p>
              <p className="profile-status-label">
                Status updated at{" "}
                {new Date(statusPost.posted_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
          ) : null}
          {normalizedProfileLinks.length > 0 ? (
            <div className="profile-links">
              {normalizedProfileLinks.map((link) => (
                <Link key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {/* TODO I think we remove this with "connections" */}
        {/* <p className="profile-stats">
          <Link href={`/${profile.handle}/followers`}>
            <strong>{profile.follower_count}</strong> Followers
          </Link>{" "}
          ·{" "}
          <Link href={`/${profile.handle}/following`}>
            <strong>{profile.following_count}</strong> Following
          </Link>
        </p> */}
      </article>
      {/* TODO I think we remove this with "connections" */}
      {/* {isOwner ? null : viewerId ? (
        <form action={profile.is_following ? unfollowUser : followUser}>
          <input type="hidden" name="targetUserId" value={profile.id} />
          <input type="hidden" name="targetHandle" value={profile.handle ?? ""} />
          <button type="submit">{profile.is_following ? "Unfollow" : "Follow"}</button>
        </form>
      ) : (
        <Link href="/welcome">Join to follow</Link>
      )} */}
      <CreatePostForm
        canPost={!!viewerId}
        action={createPost}
        profileHandle={profile.handle ?? undefined}
        isOwner={isOwner}
        disabledMessage="Join to post on this profile."
      />
      <section>
        <PostList posts={posts} statusHandle={profile.handle ?? undefined} />
      </section>
    </main>
  );
}
