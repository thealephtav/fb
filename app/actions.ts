"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { ensureDb, query } from "@/lib/db";
import { put } from "@vercel/blob";

export async function createProfile(formData: FormData) {
  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Name is required");
  }

  await ensureDb();
  await query("INSERT INTO profiles (id, name) VALUES ($1, $2)", [
    randomUUID(),
    name.trim(),
  ]);
  revalidatePath("/");
}

export async function createPost(formData: FormData) {
  const body = formData.get("body");
  const profileId = formData.get("profileId");
  const imageFile = formData.get("image");

  if (typeof body !== "string" || !body.trim()) {
    throw new Error("Post text is required");
  }
  if (typeof profileId !== "string" || !profileId.trim()) {
    throw new Error("Profile is required");
  }

  let imageUrl: string | null = null;

  if (imageFile instanceof File && imageFile.size > 0) {
    const buffer = await imageFile.arrayBuffer();
    const key = `posts/${randomUUID()}-${imageFile.name}`;
    const blob = await put(key, buffer, {
      access: "public",
      contentType: imageFile.type || "application/octet-stream",
    });
    imageUrl = blob.url;
  }

  await ensureDb();
  await query(
    "INSERT INTO posts (id, body, profile_id, image_url) VALUES ($1, $2, $3, $4)",
    [randomUUID(), body.trim(), profileId, imageUrl],
  );
  revalidatePath("/");
}
