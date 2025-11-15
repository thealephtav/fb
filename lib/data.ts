import { ensureDb, query } from "./db";

export type Profile = {
  id: string;
  name: string;
};

export type Post = {
  id: string;
  body: string;
  author_name: string | null;
  posted_at: string;
};

export async function getProfiles(): Promise<Profile[]> {
  try {
    await ensureDb();
    const result = await query<Profile>(`
      SELECT id, name
      FROM profiles
      ORDER BY created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Failed to load profiles", error);
    return [];
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    await ensureDb();
    const result = await query<Post>(`
      SELECT posts.id,
             posts.body,
             posts.posted_at,
             profiles.name AS author_name
      FROM posts
      LEFT JOIN profiles ON profiles.id = posts.profile_id
      ORDER BY posts.posted_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Failed to load posts", error);
    return [];
  }
}
