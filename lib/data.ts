import { ensureDb, query } from "./db";

export type User = {
  id: string;
  name: string | null;
  handle: string;
  pfp: string | null;
  latest_status?: string | null;
  latest_status_at?: string | null;
  private: boolean;
};

export type PublicUserProfile = {
  id: string;
  name: string | null;
  handle: string;
  pfp: string | null;
  follower_count: number;
  following_count: number;
  is_following: boolean;
  private: boolean;
};

export type ProfileLink = {
  id: number;
  profile_id: string;
  label: string;
  uri: string;
  click_count: number;
};

export type SimpleUser = {
  id: string;
  name: string | null;
  handle: string;
  pfp: string | null;
  private?: boolean;
};

export type Post = {
  id: string;
  body: string;
  author_name: string | null;
  author_handle: string;
  author_pfp: string | null;
  profile_name: string | null;
  profile_handle: string;
  profile_pfp: string | null;
  posted_at: string;
  image_url: string | null;
};

export type ExploreProfile = {
  id: string;
  name: string | null;
  handle: string;
  pfp: string | null;
  latest_status: string | null;
  latest_status_at: string | null;
};

export type OnboardingProgress = {
  has_pfp: boolean;
  has_display_name: boolean;
  has_link: boolean;
  has_status: boolean;
  has_posted_elsewhere: boolean;
};

export async function getUserById(userId: string): Promise<User | null> {
  try {
    await ensureDb();
    const result = await query<User>(
      `
        SELECT
          users.id,
          users.name,
          users.handle,
          users.pfp,
          users.private,
          status.latest_status,
          status.latest_status_at
        FROM users
        LEFT JOIN LATERAL (
          SELECT body AS latest_status, posted_at AS latest_status_at
          FROM posts
          WHERE posts.user_id = users.id AND posts.profile_user_id = users.id
          ORDER BY posted_at DESC
          LIMIT 1
        ) status ON TRUE
        WHERE users.id = $1
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
          users.private,
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

export async function getUserByHandle(handle: string): Promise<User | null> {
  try {
    await ensureDb();
    const result = await query<User>(
      `
        SELECT
          users.id,
          users.name,
          users.handle,
          users.pfp,
          users.private,
          status.latest_status,
          status.latest_status_at
        FROM users
        LEFT JOIN LATERAL (
          SELECT body AS latest_status, posted_at AS latest_status_at
          FROM posts
          WHERE posts.user_id = users.id AND posts.profile_user_id = users.id
          ORDER BY posted_at DESC
          LIMIT 1
        ) status ON TRUE
        WHERE users.handle = $1
        LIMIT 1
      `,
      [handle],
    );
    return result.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to load user by handle", error);
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
             authors.name AS author_name,
             authors.handle AS author_handle,
             authors.pfp AS author_pfp,
             wall.name AS profile_name,
             wall.handle AS profile_handle,
             wall.pfp AS profile_pfp
      FROM posts
      INNER JOIN users AS authors ON authors.id = posts.user_id
      INNER JOIN users AS wall ON wall.id = posts.profile_user_id
      ORDER BY posts.posted_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Failed to load posts", error);
    return [];
  }
}

export async function getFeedPosts(userId: string): Promise<Post[]> {
  try {
    await ensureDb();
    const result = await query<Post>(
      `
        SELECT posts.id,
               posts.body,
               posts.posted_at,
               posts.image_url,
               authors.name AS author_name,
               authors.handle AS author_handle,
               authors.pfp AS author_pfp,
               wall.name AS profile_name,
               wall.handle AS profile_handle,
               wall.pfp AS profile_pfp
        FROM posts
        INNER JOIN users AS authors ON authors.id = posts.user_id
        INNER JOIN users AS wall ON wall.id = posts.profile_user_id
        WHERE wall.id = $1
           OR EXISTS (
             SELECT 1 FROM followers
             WHERE followers.follower_id = $1
               AND followers.following_id = wall.id
           )
        ORDER BY posts.posted_at DESC
      `,
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to load feed posts", error);
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
               authors.name AS author_name,
               authors.handle AS author_handle,
               authors.pfp AS author_pfp,
               wall.name AS profile_name,
               wall.handle AS profile_handle,
               wall.pfp AS profile_pfp
        FROM posts
        INNER JOIN users AS authors ON authors.id = posts.user_id
        INNER JOIN users AS wall ON wall.id = posts.profile_user_id
        WHERE wall.handle = $1
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

export async function getFollowersByHandle(handle: string): Promise<SimpleUser[]> {
  try {
    await ensureDb();
    const result = await query<SimpleUser>(
      `
        SELECT users.id, users.name, users.handle, users.pfp
        FROM followers
        INNER JOIN users ON users.id = followers.follower_id
        INNER JOIN users AS followed ON followed.id = followers.following_id
        WHERE followed.handle = $1
        ORDER BY followers.created_at DESC
      `,
      [handle],
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to load followers", error);
    return [];
  }
}

export async function getFollowingByHandle(handle: string): Promise<SimpleUser[]> {
  try {
    await ensureDb();
    const result = await query<SimpleUser>(
      `
        SELECT users.id, users.name, users.handle, users.pfp
        FROM followers
        INNER JOIN users ON users.id = followers.following_id
        INNER JOIN users AS follower ON follower.id = followers.follower_id
        WHERE follower.handle = $1
        ORDER BY followers.created_at DESC
      `,
      [handle],
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to load following", error);
    return [];
  }
}

export async function getProfileLinksByUserId(userId: string): Promise<ProfileLink[]> {
  try {
    await ensureDb();
    const result = await query<ProfileLink>(
      `
        SELECT id, profile_id, label, uri, click_count
        FROM links
        WHERE profile_id = $1
        ORDER BY id ASC
      `,
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to load profile links", error);
    return [];
  }
}

export async function getExploreProfiles(excludeUserId?: string): Promise<ExploreProfile[]> {
  try {
    await ensureDb();
    const result = await query<ExploreProfile>(
      `
        WITH latest_posts AS (
          SELECT
            posts.user_id,
            posts.body,
            posts.posted_at,
            ROW_NUMBER() OVER (PARTITION BY posts.user_id ORDER BY posts.posted_at DESC) AS rn
          FROM posts
        )
        SELECT
          users.id,
          users.name,
          users.handle,
          users.pfp,
          lp.body AS latest_status,
          lp.posted_at AS latest_status_at
        FROM users
        LEFT JOIN latest_posts lp ON lp.user_id = users.id AND lp.rn = 1
        WHERE ($1::text IS NULL OR users.id <> $1)
        ORDER BY COALESCE(lp.posted_at, users.created_at) DESC
      `,
      [excludeUserId ?? null],
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to load explore profiles", error);
    return [];
  }
}

export async function getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
  try {
    await ensureDb();
    const result = await query<OnboardingProgress>(
      `
        SELECT
          users.pfp IS NOT NULL AS has_pfp,
          (users.name IS NOT NULL AND length(trim(users.name)) > 0) AS has_display_name,
          EXISTS (SELECT 1 FROM links WHERE profile_id = $1) AS has_link,
          EXISTS (SELECT 1 FROM posts WHERE user_id = $1 AND profile_user_id = $1) AS has_status,
          EXISTS (SELECT 1 FROM posts WHERE user_id = $1 AND profile_user_id <> $1) AS has_posted_elsewhere
        FROM users
        WHERE users.id = $1
        LIMIT 1
      `,
      [userId],
    );
    return result.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to load onboarding progress", error);
    return null;
  }
}
