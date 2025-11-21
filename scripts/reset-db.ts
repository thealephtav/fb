import "dotenv/config";
import { ensureDb, getPool } from "../lib/db";

const tables = [
  "posts",
  "followers",
  "authenticators",
  "sessions",
  "verification_token",
  "accounts",
  "users",
];

async function main() {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    for (const table of tables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
    await client.query("COMMIT");
    console.log("Dropped existing tables.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  await ensureDb();
  console.log("Database schema recreated.");
}

main()
  .catch((error) => {
    console.error("Failed to reset database", error);
    process.exit(1);
  })
  .finally(async () => {
    const pool = getPool();
    await pool.end();
  });
