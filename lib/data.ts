import { ensureDb, query } from "./db";

export type User = {
  id: string;
  name: string | null;
  handle: string | null;
  pfp: string | null;
};

export type PublicUserProfile = {
  id: string;
  name: string | null;
  handle: string | null;
  pfp: string | null;
  follower_count: number;
  following_count: number;
  is_following: boolean;
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
        SELECT id, name, handle, pfp
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

export async function getUserProfileByHandle(
  handle: string,
  viewerId: string | null,
): Promise<PublicUserProfile | null> {
  try {
    await ensureDb();
    const result = await query<PublicUserProfile>(
      `
        SELECT
          users.id,
          users.name,
          users.handle,
          users.pfp,
          (SELECT COUNT(*)::int FROM followers WHERE following_id = users.id) AS follower_count,
          (SELECT COUNT(*)::int FROM followers WHERE follower_id = users.id) AS following_count,
          CASE
            WHEN $2::text IS NULL THEN false
            ELSE EXISTS (
              SELECT 1 FROM followers WHERE follower_id = $2 AND following_id = users.id
            )
          END AS is_following
        FROM users
        WHERE handle = $1
        LIMIT 1
      `,
      [handle, viewerId],
    );
    return result.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to load profile by handle", error);
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

export async function getPostsByHandle(handle: string): Promise<Post[]> {
  try {
    await ensureDb();
    const result = await query<Post>(
      `
        SELECT posts.id,
               posts.body,
               posts.posted_at,
               posts.image_url,
               users.name AS author_name,
               users.handle AS author_handle
        FROM posts
        INNER JOIN users ON users.id = posts.user_id
        WHERE users.handle = $1
        ORDER BY posts.posted_at DESC
      `,
      [handle],
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to load posts for handle", error);
    return [];
  }
}
