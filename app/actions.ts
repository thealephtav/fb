"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { ensureDb, query } from "@/lib/db";
import { getUserById } from "@/lib/data";
import { auth, signIn, signOut } from "@/auth";
import { put } from "@vercel/blob";

export async function updateUserDetails(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to update your user.");
  }

  const name = formData.get("name");
  const handle = formData.get("handle");
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Name is required");
  }
  if (typeof handle !== "string" || !handle.trim()) {
    throw new Error("Handle is required");
  }
  const normalizedHandle = handle.trim().toLowerCase();

  const existingHandle = await query<{ exists: boolean }>(
    "SELECT EXISTS (SELECT 1 FROM users WHERE handle = $1 AND id <> $2) AS exists",
    [normalizedHandle, session.user.id],
  );

  if (existingHandle.rows[0]?.exists) {
    throw new Error("Handle is already taken.");
  }

  const existingUser = await getUserById(session.user.id);
  if (existingUser?.handle) {
    throw new Error("Your user details are already set up.");
  }

  await ensureDb();
  await query(
    "UPDATE users SET name = $1, handle = $2 WHERE id = $3",
    [name.trim(), normalizedHandle, session.user.id],
  );
  revalidatePath("/");
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to create a post.");
  }

  const body = formData.get("body");
  const imageFile = formData.get("image");

  if (typeof body !== "string" || !body.trim()) {
    throw new Error("Post text is required");
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

  const user = await getUserById(session.user.id);
  if (!user?.handle) {
    throw new Error("You need to finish setting up your user before posting.");
  }

  await ensureDb();
  await query(
    "INSERT INTO posts (id, body, user_id, image_url) VALUES ($1, $2, $3, $4)",
    [randomUUID(), body.trim(), user.id, imageUrl],
  );
  revalidatePath("/");
}

export type EmailSignInState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function signUpWithHandle(
  _prevState: EmailSignInState,
  formData: FormData,
): Promise<EmailSignInState> {
  const email = formData.get("email");
  const handle = formData.get("handle");
  if (typeof email !== "string" || !email.trim()) {
    return { status: "error", message: "Email is required" };
  }
  if (typeof handle !== "string" || !handle.trim()) {
    return { status: "error", message: "Username is required" };
  }

  const trimmedEmail = email.trim();
  const normalizedHandle = handle.trim().toLowerCase();

  await ensureDb();

  const existingUserResult = await query<{ id: string; handle: string | null }>(
    `SELECT id, handle FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [trimmedEmail],
  );
  const existingUser = existingUserResult.rows[0] ?? null;

  const handleOwner = await query<{ id: string }>(
    `SELECT id FROM users WHERE handle = $1 LIMIT 1`,
    [normalizedHandle],
  );
  const handleTakenByOther = handleOwner.rows[0] && handleOwner.rows[0].id !== existingUser?.id;
  if (handleTakenByOther) {
    return { status: "error", message: "Username already taken" };
  }

  if (existingUser) {
    if (!existingUser.handle) {
      await query("UPDATE users SET handle = $1 WHERE id = $2", [normalizedHandle, existingUser.id]);
    }
  } else {
    await query(
      "INSERT INTO users (email, handle) VALUES ($1, $2)",
      [trimmedEmail, normalizedHandle],
    );
  }

  try {
    await signIn("email", {
      email: trimmedEmail,
      redirectTo: "/",
      redirect: false,
    });
    return {
      status: "sent",
      message: existingUser
        ? "Email sent! Check your inbox."
        : "Email sent! Check your inbox.",
    };
  } catch (error) {
    console.error("Failed to send email", error);
    return { status: "error", message: "Failed to send email" };
  }
}

export async function signInWithEmail(
  _prevState: EmailSignInState,
  formData: FormData,
): Promise<EmailSignInState> {
  const email = formData.get("email");
  if (typeof email !== "string" || !email.trim()) {
    return { status: "error", message: "Email is required" };
  }

  await ensureDb();
  try {
    await signIn("email", {
      email: email.trim(),
      redirectTo: "/",
      redirect: false,
    });
    return { status: "sent", message: "Email sent! Check your inbox." };
  } catch (error) {
    console.error("Failed to send email", error);
    return { status: "error", message: "Failed to send email" };
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
