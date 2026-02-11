import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPostsByHandle, getUserProfileByHandle, getProfileLinksByUserId } from "@/lib/data";
import { createPost } from "@/app/actions";
import { PostList } from "@/components/PostList";
import { CreatePostForm } from "@/components/CreatePostForm";
import { WAITLIST_URL } from "@/lib/constants";
import { ProfileHero } from "@/components/ProfileHero";
import { NavBar } from "@/components/NavBar";

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
  const profile = await getUserProfileByHandle(normalizedHandle, viewerId);
  if (!profile) {
    notFound();
  }

  const isPrivateView = profile.private && !viewerId;
  const posts = isPrivateView ? [] : await getPostsByHandle(normalizedHandle);
  const profileLinks = isPrivateView ? [] : await getProfileLinksByUserId(profile.id);

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

  if (isPrivateView) {
    return (
      <main className="centered-vert" style={{ textAlign: "center", gap: "1.5rem" }}>
        <ProfileHero
          profileHandle={profile.handle}
          profileName={displayName}
          profilePfp={profile.pfp}
          profilePfp2={profile.pfp2}
          profilePfp3={profile.pfp3}
          showStatus={false}
        />
        <p className="emboss" style={{ marginTop: "0.5rem" }}>
          Sign in to see this profile.
        </p>
        <Link href="/sign-in">
          <button className="btn btnLg lifted">Sign In</button>
        </Link>
      </main>
    );
  }

  return (
    <main>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xl)",
        }}
      >
        <NavBar>
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
        </NavBar>
        <ProfileHero
          profileHandle={profile.handle}
          profileName={displayName}
          profilePfp={profile.pfp}
          profilePfp2={profile.pfp2}
          profilePfp3={profile.pfp3}
          statusText={statusPost?.body ?? null}
          statusUpdatedAt={
            statusPost
              ? new Date(statusPost.posted_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
              : null
          }
        />
        <section className="profile-links">
          {normalizedProfileLinks.length > 0 ? (
            <div className="profile-links">
              {normalizedProfileLinks.map((link) => (
                <Link key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">
                  <button className="btn btnLg emboss lifted">{link.label}</button>
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        <div style={{ flex: 1 }} />
          <section className="waitlist-footer">
          {!viewerId ? (
            <Link className="emboss" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
              「 ✦ Join The Aleph Waitlist ✦ 」📢
            </Link>
          ) : (
            <Link
              href="/"
              className="emboss"
              aria-label="Aleph"
            >
              𖡼𖤣𖥧𖡼𓋼𖤣𖥧𓍊  Aleph  𓍊𖡼𖤣𖥧𓋼𖥧𖡼
            </Link>
          )}
        </section>
      </div>

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
