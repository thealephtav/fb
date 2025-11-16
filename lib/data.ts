import { ensureDb, query } from "./db";

export type User = {
  id: string;
  name: string | null;
  handle: string | null;
};

export type Post = {
  id: string;
  body: string;
  author_name: string | null;
  author_handle: string | null;
  posted_at: string;
  image_url: string | null;
};

export async function getUserById(userId: string): Promise<User | null> {
  try {
    await ensureDb();
    const result = await query<User>(
      `
        SELECT id, name, handle
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [userId],
    );
    return result.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to load user by id", error);
    return null;
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    await ensureDb();
    const result = await query<Post>(`
      SELECT posts.id,
             posts.body,
             posts.posted_at,
             posts.image_url,
             users.name AS author_name,
             users.handle AS author_handle
      FROM posts
      LEFT JOIN users ON users.id = posts.user_id
      ORDER BY posts.posted_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Failed to load posts", error);
    return [];
  }
}
