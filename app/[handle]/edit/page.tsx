import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProfileLinksByUserId, getUserProfileByHandle } from "@/lib/data";
import { updateUserProfile } from "@/app/actions";
import { EditProfileForm } from "@/components/EditProfileForm";
import { NavBar } from "@/components/NavBar";
import Link from "next/link";

export default async function EditProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
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
    <main>
      <NavBar>
        <Link href="/" className="emboss badge" aria-label="Home">
          ⾕
        </Link>
        <Link href={`/${profile.handle}`} className="emboss badge" aria-label="View profile" style={{ marginLeft: "auto" }}>
          ☻
        </Link>
      </NavBar>
      <h1 className="deboss centered">Edit Profile</h1>
      <EditProfileForm profile={profile} profileLinks={profileLinks} action={updateUserProfile} />
    </main>
  );
}
