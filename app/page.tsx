import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getFeedPosts, getUserById } from "@/lib/data";
import { createPost, updateUserDetails, signOutUser } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/welcome");
  }
  const userId = session?.user?.id ?? null;
  const [userResult, posts] = await Promise.all([
    userId ? getUserById(userId) : Promise.resolve(null),
    userId ? getFeedPosts(userId) : Promise.resolve([]),
  ]);
  const activeUser = userResult?.handle ? userResult : null;
  const displayName = activeUser ? `@${activeUser.handle}` : session?.user?.name ?? "friend";

  return (
    <main>
      <h1>Bookface</h1>
      <p>Hello {displayName}</p>

      <div>
        <form action={signOutUser}>
          <button type="submit">Log Out</button>
        </form>
      </div>

        {!activeUser ? (
          <section>
            <h2>Set Up Your User</h2>
            <form action={updateUserDetails}>
              <div>
                <label htmlFor="user-name">Name</label>
              </div>
              <div>
                <input id="user-name" name="name" required />
              </div>
              <div>
                <label htmlFor="user-handle">Handle</label>
              </div>
              <div>
                <input
                  id="user-handle"
                  name="handle"
                  required
                  pattern="[a-z0-9_\-]+"
                  title="Use lowercase letters, numbers, underscores, or dashes"
                />
              </div>
              <button type="submit">Save User</button>
            </form>
          </section>
        ) : null}

        <section>
          <h2>Create Post</h2>
          {activeUser ? (
            <form action={createPost}>
              <p>Posting as @{activeUser.handle}</p>
              <div>
                <label htmlFor="post-body">Post Text</label>
              </div>
              <div>
                <textarea id="post-body" name="body" required rows={4} />
              </div>
              <div>
                <label htmlFor="post-image">Image (optional)</label>
              </div>
              <div>
                <input
                  id="post-image"
                  name="image"
                  type="file"
                  accept="image/*"
                />
              </div>
              <button type="submit">Post</button>
            </form>
          ) : (
            <p>Finish setting up your user before posting.</p>
          )}
        </section>

      <section>
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <div>{post.body}</div>
                <div>
                  by {post.author_handle ? (
                    <Link href={`/u/${post.author_handle}`}>@{post.author_handle}</Link>
                  ) : post.author_name ?? "Unknown"} on {new Date(post.posted_at).toLocaleString()}
                </div>
                {post.image_url ? (
                  <div>
                    <Image
                      src={post.image_url}
                      alt="Post image"
                      width={400}
                      height={300}
                      style={{ height: "auto", width: "100%", maxWidth: 400 }}
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
