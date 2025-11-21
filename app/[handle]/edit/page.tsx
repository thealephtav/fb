import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProfileLinksByUserId, getUserProfileByHandle } from "@/lib/data";
import { updateUserProfile } from "@/app/actions";
import { ProfileLinksEditor } from "@/components/ProfileLinksEditor";

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
  const profileLinks = await getProfileLinksByUserId(profile.id);

  return (
    <main className="feed">
      <h1>Edit Profile</h1>
      <form action={updateUserProfile}>
        <div>
          <label htmlFor="displayName">Display name</label>
        </div>
        <div>
          <input
            id="displayName"
            name="displayName"
            type="text"
            defaultValue={profile.name ?? ""}
            placeholder="How should we show your name?"
          />
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
        </div>
        <div>
          <textarea id="bio" name="bio" rows={4} defaultValue={profile.bio ?? ""} />
        </div>
        <div>
          <label>Links</label>
        </div>
        <ProfileLinksEditor initialLinks={profileLinks} />
        <div>
          <label htmlFor="pfp">Profile photo</label>
        </div>
        <div>
          <input id="pfp" name="pfp" type="file" accept="image/*" />
        </div>
        <button type="submit">Save</button>
      </form>
      <p>
        <Link href={`/${profile.handle}`}>Back to profile</Link>
      </p>
    </main>
  );
}
