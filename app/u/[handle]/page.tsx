import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPostsByHandle, getUserProfileByHandle } from "@/lib/data";
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

  const isOwner = viewerId === profile.id;

  return (
    <main className="feed">
      <article className="profile-card">
        <div className="profile-info">
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
          <div>
            <h1>@{profile.handle}</h1>
            {/* {profile.name ? <p><strong>{profile.name}</strong></p> : null} */}
            {profile.bio ? <p><i>{profile.bio}</i></p> : null}
          </div>
        </div>
        <p className="profile-stats">
          <Link href={`/u/${profile.handle}/followers`}>
            <strong>{profile.follower_count}</strong> Followers
          </Link>{" "}
          ·{" "}
          <Link href={`/u/${profile.handle}/following`}>
            <strong>{profile.following_count}</strong> Following
          </Link>
        </p>
      </article>
      {isOwner ? (
        <Link href={`/u/${profile.handle}/edit`}>Edit Profile</Link>
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
        <h2>Posts</h2>
        <PostList posts={posts} />
      </section>
    </main>
  );
}
