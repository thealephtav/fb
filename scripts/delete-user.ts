import "dotenv/config";
import { ensureDb, query } from "../lib/db";

async function main() {
  const handle = process.argv[2]?.trim().toLowerCase();
  if (!handle) {
    console.error("Usage: pnpm ts-node scripts/delete-user.ts <handle>");
    process.exit(1);
  }

  await ensureDb();

  const userResult = await query<{ id: string }>(
    `SELECT id FROM users WHERE handle = $1 LIMIT 1`,
    [handle],
  );
  const user = userResult.rows[0];

  if (!user) {
    console.error(`No user found with handle "${handle}"`);
    process.exit(1);
  }

  await query("DELETE FROM users WHERE id = $1", [user.id]);
  console.log(`Deleted user "${handle}" and all related data (cascade).`);
}

main().catch((error) => {
  console.error("Failed to delete user", error);
  process.exit(1);
});
