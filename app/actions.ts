"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { ensureDb, query } from "@/lib/db";
import { getPool } from "@/lib/db";
import { getUserByHandle, getUserById } from "@/lib/data";
import { auth, signIn, signOut } from "@/auth";
import { put } from "@vercel/blob";

const RESERVED_HANDLES = new Set(["edit", "admin", "sign-in", "api", "not-found"]);

function assertHandleAllowed(handle: string) {
  if (RESERVED_HANDLES.has(handle)) {
    throw new Error("That username is not available.");
  }
}

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
  assertHandleAllowed(normalizedHandle);

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
  const profileHandleInput = formData.get("profileHandle");

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

  let targetProfile = user;
  if (typeof profileHandleInput === "string" && profileHandleInput.trim()) {
    const normalizedHandle = profileHandleInput.trim().toLowerCase();
    const fetchedProfile = await getUserByHandle(normalizedHandle);
    if (!fetchedProfile) {
      throw new Error("Profile not found");
    }
    targetProfile = fetchedProfile;
  }

  await ensureDb();
  await query(
    "INSERT INTO posts (id, body, user_id, profile_user_id, image_url) VALUES ($1, $2, $3, $4, $5)",
    [randomUUID(), body.trim(), user.id, targetProfile.id, imageUrl],
  );
  if (targetProfile.handle) {
    revalidatePath(`/${targetProfile.handle}`);
  }
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
  if (RESERVED_HANDLES.has(normalizedHandle)) {
    return { status: "error", message: "Username is not available" };
  }

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

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to update your profile.");
  }

  await ensureDb();
  const user = await getUserById(session.user.id);
  if (!user) {
    throw new Error("User not found");
  }

  const file = formData.get("pfp");
  const updates: string[] = [];
  const params: unknown[] = [];

  const displayNameValue = formData.get("displayName");
  if (typeof displayNameValue === "string") {
    const trimmedName = displayNameValue.trim();
    updates.push(`name = $${updates.length + 1}`);
    params.push(trimmedName.length > 0 ? trimmedName : null);
  }

  const linkLabels = formData.getAll("linkLabel").map((value) =>
    typeof value === "string" ? value.trim() : "",
  );
  const linkUrls = formData.getAll("linkUrl").map((value) =>
    typeof value === "string" ? value.trim() : "",
  );

  const parsedLinks = linkLabels.reduce<{ label: string; uri: string }[]>((acc, label, idx) => {
    const uri = linkUrls[idx] ?? "";
    if (!label || !uri) {
      return acc;
    }
    const normalizedUri = /^https?:\/\//i.test(uri) ? uri : `https://${uri}`;
    acc.push({ label, uri: normalizedUri });
    return acc;
  }, []);

  if (file instanceof File && file.size > 0) {
    const buffer = await file.arrayBuffer();
    const key = `pfp/${randomUUID()}-${file.name}`;
    const blob = await put(key, buffer, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });
    updates.push(`pfp = $${updates.length + 1}`);
    params.push(blob.url);
  }

  params.push(session.user.id);

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    if (updates.length > 0) {
      await client.query(`UPDATE users SET ${updates.join(", ")} WHERE id = $${params.length}`, params);
    }
    await client.query(`DELETE FROM links WHERE profile_id = $1`, [session.user.id]);
    for (const link of parsedLinks) {
      await client.query(
        `INSERT INTO links (profile_id, label, uri) VALUES ($1, $2, $3)`,
        [session.user.id, link.label, link.uri],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  if (user.handle) {
    revalidatePath(`/${user.handle}`);
    revalidatePath(`/${user.handle}/edit`);
  }
}

export async function followUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to follow users.");
  }
  const targetUserId = formData.get("targetUserId");
  const targetHandle = formData.get("targetHandle");
  if (typeof targetUserId !== "string" || !targetUserId) {
    throw new Error("Invalid target user");
  }
  if (targetUserId === session.user.id) {
    throw new Error("You cannot follow yourself.");
  }

  await ensureDb();
  await query(
    `INSERT INTO followers (follower_id, following_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [session.user.id, targetUserId],
  );
  if (typeof targetHandle === "string" && targetHandle) {
    revalidatePath(`/${targetHandle}`);
  }
}

export async function unfollowUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to unfollow users.");
  }
  const targetUserId = formData.get("targetUserId");
  const targetHandle = formData.get("targetHandle");
  if (typeof targetUserId !== "string" || !targetUserId) {
    throw new Error("Invalid target user");
  }
  if (targetUserId === session.user.id) {
    throw new Error("You cannot unfollow yourself.");
  }

  await ensureDb();
  await query(`DELETE FROM followers WHERE follower_id = $1 AND following_id = $2`, [
    session.user.id,
    targetUserId,
  ]);
  if (typeof targetHandle === "string" && targetHandle) {
    revalidatePath(`/${targetHandle}`);
  }
}
