import "dotenv/config";
import { ensureDb, query } from "@/lib/db";

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
  const createdBy = process.argv[3] ?? null;
  const count = Number.parseInt(countArg ?? "1", 10);
  if (!Number.isFinite(count) || count <= 0) {
    throw new Error("Usage: pnpm ts-node scripts/generate-referral-codes.ts <count> [createdByUserId]");
  }

  await ensureDb();

  const createdCodes: string[] = [];
  while (createdCodes.length < count) {
    const code = generateCode();
    const result = await query(
      `
        INSERT INTO referral_codes (code, created_by_user_id, metadata)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
        RETURNING code
      `,
      [code, createdBy, { note: "manual alpha testing" }],
    );
    if (result.rowCount && result.rows[0]?.code) {
      createdCodes.push(result.rows[0].code);
    }
  }

  console.log(`Created ${createdCodes.length} referral code(s):`, createdCodes.join(", "));
}

main().catch((error) => {
  console.error("Failed to generate referral codes", error);
  process.exit(1);
});
