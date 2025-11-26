import { Pool } from "pg";
import type { QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getPool() {
  if (pool) {
    return pool;
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to Postgres");
  }

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
  });
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const client = await getPool().connect();
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
      handle TEXT UNIQUE,
      private BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  // TODO delete
  await query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS private BOOLEAN NOT NULL DEFAULT FALSE
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS links (
      id BIGSERIAL PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      uri TEXT NOT NULL,
      click_count INT NOT NULL DEFAULT 0
    )
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

  await query(`
    CREATE TABLE IF NOT EXISTS followers (
      follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (follower_id, following_id)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS referral_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_by_user_id TEXT REFERENCES users(id),
      max_uses INT NOT NULL DEFAULT 1,
      uses_count INT NOT NULL DEFAULT 0,
      expires_at TIMESTAMPTZ,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      metadata JSONB DEFAULT '{}'::jsonb
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
