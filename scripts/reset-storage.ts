import "dotenv/config";
import { del, list } from "@vercel/blob";

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required to clear blob storage");
  }

  let cursor: string | undefined;
  let removed = 0;

  do {
    const response = await list({ token, cursor, limit: 1000 });
    if (response.blobs.length > 0) {
      await Promise.all(response.blobs.map((blob) => del(blob.url, { token })));
      removed += response.blobs.length;
    }
    cursor = response.cursor;
  } while (cursor);

  console.log(`Removed ${removed} blob${removed === 1 ? "" : "s"}.`);
}

main().catch((error) => {
  console.error("Failed to reset blob storage", error);
  process.exit(1);
});
