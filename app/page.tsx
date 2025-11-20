import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getFeedPosts, getUserById } from "@/lib/data";
import { createPost, updateUserDetails } from "./actions";
import { CreatePostForm } from "@/components/CreatePostForm";
import { PostList } from "@/components/PostList";

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

  return (
    <main>
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

        <CreatePostForm canPost={!!activeUser} action={createPost} />

      <section>
        <h2>Posts</h2>
        <PostList posts={posts} emptyMessage="No posts yet." />
      </section>
    </main>
  );
}
