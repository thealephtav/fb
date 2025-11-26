"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileLinksEditor } from "@/components/ProfileLinksEditor";
import { MAX_PFP_SIZE_BYTES } from "@/lib/constants";

type Profile = {
  id: string;
  handle: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    const confirmLeave = () =>
      window.confirm("You have unsaved changes. Please save before leaving this page.");

    const handleClick = (event: MouseEvent) => {
      if (!isDirty) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (anchor && anchor.href && anchor.target !== "_blank") {
        if (anchor.dataset.skipDirtyCheck === "true") {
          return;
        }
        const ok = confirmLeave();
        if (!ok) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };

    const handlePopState = () => {
      if (!isDirty) return;
      const ok = confirmLeave();
      if (!ok) {
        history.pushState(null, "", window.location.href);
      }
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form
      action={action}
      className="post-form"
      onChange={() => setIsDirty(true)}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setErrorMessage(null);

        const file = formData.get("pfp");
        if (file instanceof File && file.size > MAX_PFP_SIZE_BYTES) {
          setErrorMessage("Image is too large. Please upload a photo under 10 MB.");
          return;
        }

        const labels = formData.getAll("linkLabel").map((v) => (typeof v === "string" ? v.trim() : ""));
        const urls = formData.getAll("linkUrl").map((v) => (typeof v === "string" ? v.trim() : ""));
        const isValidUrl = (value: string) => {
          try {
            const url = new URL(value.startsWith("http") ? value : `https://${value}`);
            return !!url.hostname;
          } catch {
            return false;
          }
        };
        for (let i = 0; i < Math.max(labels.length, urls.length); i++) {
          if (!labels[i] || !urls[i] || !isValidUrl(urls[i])) {
            alert("Each link needs a name and a valid URL before saving.");
            return;
          }
        }

        setIsSaving(true);
        setIsDirty(false);
        await action(formData);
        setIsSaving(false);
        window.location.href = `/${profile.handle}`;
      }}
    >
      <p className="emboss" style={{ textAlign: "center" }}>Picture</p>
      <div style={{ display: "flex", justifyContent: "center", margin: "var(--space-md) 0" }}>
        <label htmlFor="pfp" className="profile-avatar lifted" style={{ cursor: "pointer" }}>
          <Image
            src={previewUrl ?? profile.pfp ?? "/default-pfp.png"}
            alt={`@${profile.handle} profile photo`}
            width={96}
            height={96}
          />
          <span className="pfp-overlay"></span>
        </label>
        <input
          id="pfp"
          name="pfp"
          type="file"
          accept="image/*"
          className="invisible"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            if (!file) {
              setPreviewUrl(null);
              return;
            }
            const nextUrl = URL.createObjectURL(file);
            setPreviewUrl((current) => {
              if (current) URL.revokeObjectURL(current);
              return nextUrl;
            });
          }}
        />
      </div>
      <p className="emboss" style={{ textAlign: "left", marginBottom: "0" }}>Display Name</p>
      <input
        id="displayName"
        name="displayName"
        type="text"
        defaultValue={profile.name ?? ""}
        placeholder="Display name"
        className="input"
      />
      <p className="emboss" style={{ textAlign: "left" }}>Links</p>
      <ProfileLinksEditor initialLinks={profileLinks} onEdit={() => setIsDirty(true)} />
      <button
        type="submit"
        className={`btn btnMd ${isDirty ? "lifted" : "sunken"}`}
        disabled={!isDirty || isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
        {errorMessage? errorMessage : isDirty ? "You have unsaved changes." : "All changes saved."}
      </p>
      <p style={{ textAlign: "center" }} className="emboss">
        <Link
          href={`/${profile.handle}`}
          data-skip-dirty-check="true"
          onClick={(event) => {
            if (isDirty) {
              event.preventDefault();
              alert("Please save your changes before leaving this page.");
            }
          }}
        >
          ← Back to profile
        </Link>
      </p>
    </form>
  );
}
