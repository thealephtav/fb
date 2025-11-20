import { Pool } from "pg";
import type { QueryResult, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to connect to Postgres");
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

async function createTables() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT,
      email TEXT UNIQUE,
      "emailVerified" TIMESTAMPTZ,
      image TEXT,
      pfp TEXT,
      bio TEXT,
      handle TEXT UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // TODO delete
  await query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS pfp TEXT
  `);
  // TODO delete
  await query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS bio TEXT
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "sessionToken" TEXT UNIQUE NOT NULL,
      "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMPTZ NOT NULL
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS verification_token (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (identifier, token)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS authenticators (
      "credentialID" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      "credentialPublicKey" TEXT NOT NULL,
      counter BIGINT NOT NULL,
      "credentialDeviceType" TEXT NOT NULL,
      "credentialBackedUp" BOOLEAN NOT NULL,
      transports TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      profile_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      image_url TEXT,
      posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // TODO delete
  await query(`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS profile_user_id TEXT REFERENCES users(id) ON DELETE CASCADE
  `);
  // TODO delete
  await query(`
    UPDATE posts
    SET profile_user_id = user_id
    WHERE profile_user_id IS NULL
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS followers (
      follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (follower_id, following_id)
    )
  `);
}

let initPromise: Promise<void> | null = null;

export function ensureDb() {
  if (!initPromise) {
    initPromise = createTables().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}
