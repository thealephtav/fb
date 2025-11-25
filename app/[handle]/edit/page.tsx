import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProfileLinksByUserId, getUserProfileByHandle } from "@/lib/data";
import { updateUserProfile } from "@/app/actions";
import { EditProfileForm } from "@/components/EditProfileForm";

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
    <main>
      <h1 className="deboss edit-page-title">Edit Profile</h1>
      <EditProfileForm profile={profile} profileLinks={profileLinks} action={updateUserProfile} />
    </main>
  );
}
