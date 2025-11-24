import Image from "next/image";
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
      <h1 className="deboss edit-page-title">Edit Profile</h1>
      <form action={updateUserProfile} encType="multipart/form-data" className="post-form">
        <div style={{ display: "flex", justifyContent: "center", margin: "var(--space-md) 0" }}>
          <label htmlFor="pfp" className="profile-avatar lifted" style={{ cursor: "pointer" }}>
            <Image
              src={profile.pfp ?? "/default-pfp.png"}
              alt={`@${profile.handle} profile photo`}
              width={96}
              height={96}
            />
            <span className="pfp-overlay"></span>
          </label>
          <input id="pfp" name="pfp" type="file" accept="image/*" className="visually-hidden" />
        </div>
        <div className="profile-edit-field">
          <input
            id="displayName"
            name="displayName"
            type="text"
            defaultValue={profile.name ?? ""}
            placeholder="Display name"
            className="profile-name-input input-unstyled"
          />
        </div>
        <div>
          <label>Links</label>
        </div>
        <ProfileLinksEditor initialLinks={profileLinks} />
        <button type="submit">Save</button>
      </form>
      <p>
        <Link href={`/${profile.handle}`}>Back to profile</Link>
      </p>
    </main>
  );
}
