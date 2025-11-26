import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPostsByHandle, getUserProfileByHandle, getProfileLinksByUserId } from "@/lib/data";
import { createPost } from "@/app/actions";
import { PostList } from "@/components/PostList";
import { CreatePostForm } from "@/components/CreatePostForm";
import { WAITLIST_URL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const handleParam = typeof resolvedParams.handle === "string" ? resolvedParams.handle : "";
  const normalizedHandle = handleParam.trim().toLowerCase();
  const profile = await getUserProfileByHandle(normalizedHandle, null);
  if (!profile) {
    return { title: "Profile not found | Aleph" };
  }
  const displayName = profile.name?.trim() ? profile.name.trim() : `@${profile.handle}`;
  return {
    title: `${displayName ? displayName : `@${profile.handle}`} | Aleph`,
  };
}

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
      if (!href || !label) {
        return null;
      }
      return { id: link.id, href, label };
    })
    .filter((link): link is { id: number; href: string; label: string } => link !== null);
  const statusPost = posts.find(
    (post) => post.author_handle === profile.handle && post.profile_handle === profile.handle,
  );
  const isOwner = viewerId === profile.id;

  return (
    <main>
      <section className="profile-hero-section">
        {/* TODO: componentize this */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          fontSize: "var(--font-size-lg)",
          minHeight: "2rem"
        }}>          
          <Link
            href="/"
            className="emboss badge"
            aria-label="Home"
            style={{ textAlign: "left" }}
          >
            ⾕
          </Link>
          {isOwner ? (
            <Link
              href={`/${profile.handle}/edit`}
              className="emboss badge"
              aria-label="Edit profile"
              style={{ marginLeft: "auto", textAlign: "right" }}
            >
              ✎
            </Link>
          ) : null}
        </div>
        <div className="profile-avatar lifted">
          {profile.pfp ? (
            <Image
              src={profile.pfp}
              alt={`@${profile.handle} profile picture`}
              width={96}
              height={96}
            />
          ) : (
            <Image src="/default-pfp.png" alt="Default profile" width={96} height={96} />
          )}
        </div>
        <h1 className="profile-handle deboss">{displayName}</h1>
        {statusPost ? (
          <div className="profile-status">
            <p className="profile-status-body emboss">{statusPost.body}</p>
            <small className="profile-status-label">
              Status updated at{" "}
              {new Date(statusPost.posted_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </small>
          </div>
        ) : null}
        {normalizedProfileLinks.length > 0 ? (
          <div className="profile-links">
            {normalizedProfileLinks.map((link) => (
              <Link key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">
                <button className="btn btnLg emboss lifted">{link.label}</button>
              </Link>
            ))}
          </div>
        ) : null}
        <div className="waitlist-footer">
          {!viewerId ? (
              <Link className="emboss" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
              「 ✦ Join The Aleph Waitlist ✦ 」📢
              </Link>
          ) :
            <Link
              href="/"
              className="emboss"
              aria-label="Aleph"
            >
              𖡼𖤣𖥧𖡼𓋼𖤣𖥧𓍊  Aleph  𓍊𖡼𖤣𖥧𓋼𖥧𖡼
            </Link>
          }
        </div>
      </section>

      <section className="profile-content">
        <CreatePostForm
          canPost={!!viewerId}
          action={createPost}
          profileHandle={profile.handle}
          profileDisplayName={displayName}
          isOwner={isOwner}
        />
        <PostList posts={posts} statusHandle={profile.handle} />
      </section>
    </main>
  );
}
