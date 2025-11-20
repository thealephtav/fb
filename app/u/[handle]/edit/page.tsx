import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileByHandle } from "@/lib/data";
import { updateUserProfile } from "@/app/actions";

export default async function EditProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/welcome");
  }
  const viewerId = session.user.id;
  const handleParam = typeof resolvedParams.handle === "string" ? resolvedParams.handle : "";
  const handle = handleParam.trim().toLowerCase();
  const profile = await getUserProfileByHandle(handle, viewerId);

  if (!profile || profile.id !== viewerId) {
    notFound();
  }

  return (
    <main className="feed">
      <h1>Edit Profile</h1>
      <form action={updateUserProfile}>
        <div>
          <label htmlFor="bio">Bio</label>
        </div>
        <div>
          <textarea id="bio" name="bio" rows={4} defaultValue={profile.bio ?? ""} />
        </div>
        <div>
          <label htmlFor="pfp">Profile photo</label>
        </div>
        <div>
          <input id="pfp" name="pfp" type="file" accept="image/*" />
        </div>
        <button type="submit">Save</button>
      </form>
      <p>
        <Link href={`/u/${profile.handle}`}>Back to profile</Link>
      </p>
    </main>
  );
}
