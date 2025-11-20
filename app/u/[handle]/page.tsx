import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPostsByHandle, getUserProfileByHandle } from "@/lib/data";
import { followUser, unfollowUser, uploadProfileImage } from "@/app/actions";

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
  const imageContent = profile.pfp ? (
    <Image
      src={profile.pfp}
      alt={`@${profile.handle ?? "user"} profile picture`}
      width={120}
      height={120}
    />
  ) : (
    <div>
      <span role="img" aria-label="profile placeholder">
        👤
      </span>
      {isOwner ? (
        <form action={uploadProfileImage}>
          <input type="file" name="pfp" accept="image/*" required />
          <button type="submit">Upload profile photo</button>
        </form>
      ) : null}
    </div>
  );

  return (
    <main>
      <div>
        <h1>@{profile.handle}</h1>
        {profile.name ? <p>{profile.name}</p> : null}
      </div>
      {imageContent}
      <p>
        <Link href={`/u/${profile.handle}/followers`}>
          <strong>{profile.follower_count}</strong> Followers
        </Link>{" "}
        ·{" "}
        <Link href={`/u/${profile.handle}/following`}>
          <strong>{profile.following_count}</strong> Following
        </Link>
      </p>
      {isOwner ? (
        <Link href="/">Edit Profile</Link>
      ) : viewerId ? (
        <form action={profile.is_following ? unfollowUser : followUser}>
          <input type="hidden" name="targetUserId" value={profile.id} />
          <input type="hidden" name="targetHandle" value={profile.handle ?? ""} />
          <button type="submit">{profile.is_following ? "Unfollow" : "Follow"}</button>
        </form>
      ) : (
        <Link href="/welcome">Join to follow</Link>
      )}
      <section>
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <p>{post.body}</p>
                <small>{new Date(post.posted_at).toLocaleString()}</small>
                {post.image_url ? (
                  <div>
                    <Image
                      src={post.image_url}
                      alt="Post image"
                      width={400}
                      height={400}
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
