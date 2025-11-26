import "dotenv/config";
import { ensureDb, query } from "@/lib/db";
import fs from "node:fs/promises";
import path from "node:path";

const ALPHANUM = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * ALPHANUM.length);
    code += ALPHANUM[index];
  }
  return code;
}

async function main() {
  const countArg = process.argv[2];
  const createdByHandle = process.argv[3] ?? null;
  const outputPath = process.argv[4] ?? "referral-codes.txt";
  const count = Number.parseInt(countArg ?? "1", 10);
  if (!Number.isFinite(count) || count <= 0) {
    throw new Error(
      "Usage: pnpm ts-node scripts/generate-referral-codes.ts <count> [createdByHandle] [outputPath]",
    );
  }

  await ensureDb();
  let createdBy: string | null = null;

  if (createdByHandle) {
    const creatorResult = await query<{ id: string }>(
      `SELECT id FROM users WHERE handle = $1 LIMIT 1`,
      [createdByHandle],
    );
    const creatorId = creatorResult.rows[0]?.id;
    if (!creatorId) {
      throw new Error(`No user found for handle "${createdByHandle}"`);
    }
    createdBy = creatorId;
  }

  const createdCodes: string[] = [];
  while (createdCodes.length < count) {
    const batchSize = count - createdCodes.length;
    const batchCodes = new Set<string>();
    while (batchCodes.size < batchSize) {
      batchCodes.add(generateCode());
    }

    // Build a bulk insert query with placeholder slots per row
    const values: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;
    for (const code of batchCodes) {
      values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
      params.push(code, createdBy, { note: "manual alpha testing" });
    }

    const result = await query(
      `
        INSERT INTO referral_codes (code, created_by_user_id, metadata)
        VALUES ${values.join(", ")}
        ON CONFLICT DO NOTHING
        RETURNING code
      `,
      params,
    );

    if (result.rows?.length) {
      createdCodes.push(...result.rows.map((row) => row.code as string));
    }
  }

  const resolvedPath = path.resolve(outputPath);
  await fs.writeFile(resolvedPath, createdCodes.join("\n"), "utf8");

  console.log(`Created ${createdCodes.length} referral code(s). Saved to ${resolvedPath}.`);
}

main().catch((error) => {
  console.error("Failed to generate referral codes", error);
  process.exit(1);
});
