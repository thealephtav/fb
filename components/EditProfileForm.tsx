"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileLinksEditor } from "@/components/ProfileLinksEditor";

type Profile = {
  id: string;
  handle: string | null;
  name: string | null;
  pfp: string | null;
};

type ProfileLink = {
  id?: number;
  label: string;
  uri: string;
  click_count?: number;
};

type Props = {
  profile: Profile;
  profileLinks: ProfileLink[];
  action: (formData: FormData) => Promise<void>;
};

export function EditProfileForm({ profile, profileLinks, action }: Props) {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return (
    <form
      action={action}
      className="post-form"
      onChange={() => setIsDirty(true)}
      onSubmit={() => setIsDirty(false)}
    >
      <div style={{ display: "flex", justifyContent: "center", margin: "var(--space-md) 0" }}>
        <label htmlFor="pfp" className="profile-avatar lifted" style={{ cursor: "pointer" }}>
          <Image
            src={profile.pfp ?? "/default-pfp.png"}
            alt={`@${profile.handle ?? "user"} profile photo`}
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
        <label className="profile-links-label deboss">Links</label>
      </div>
      <ProfileLinksEditor initialLinks={profileLinks} />
      <button type="submit" className="floating">Save</button>
      <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
        {isDirty ? "You have unsaved changes." : "All changes saved."}
      </p>
      <p style={{ textAlign: "center" }}>
        <Link href={`/${profile.handle ?? ""}`}>Back to profile</Link>
      </p>
    </form>
  );
}
