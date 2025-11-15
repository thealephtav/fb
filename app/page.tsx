import { getPosts, getProfiles } from "@/lib/data";
import { createPost, createProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profiles, posts] = await Promise.all([getProfiles(), getPosts()]);

  return (
    <main>
      <h1>Bookface</h1>

      <section>
        <h2>Create Profile</h2>
        <form action={createProfile}>
          <div>
            <label htmlFor="profile-name">Name</label>
          </div>
          <div>
            <input id="profile-name" name="name" required />
          </div>
          <button type="submit">Save Profile</button>
        </form>
      </section>

      <section>
        <h2>Create Post</h2>
        <form action={createPost}>
          <div>
            <label htmlFor="post-body">Post Text</label>
          </div>
          <div>
            <textarea id="post-body" name="body" required rows={4} />
          </div>
          <div>
            <label htmlFor="post-profile">Author</label>
          </div>
          <div>
            <select id="post-profile" name="profileId" required>
              <option value="">Select a profile</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Save Post</button>
        </form>
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
                  by {post.author_name ?? "Unknown"} on {" "}
                  {new Date(post.posted_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
