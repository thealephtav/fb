"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileLinksEditor } from "@/components/ProfileLinksEditor";
import { MAX_PFP_SIZE_BYTES } from "@/lib/constants";

type Profile = {
  id: string;
  handle: string;
  name: string | null;
  pfp: string | null;
  pfp2: string | null;
  pfp3: string | null;
  private: boolean;
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

const PHOTO_FIELDS = ["pfp", "pfp2", "pfp3"] as const;

export function EditProfileForm({ profile, profileLinks, action }: Props) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<(typeof PHOTO_FIELDS)[number], string | null>>({
    pfp: null,
    pfp2: null,
    pfp3: null,
  });

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
      Object.values(previewUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const initialPhotos = useMemo(
    () => ({
      pfp: profile.pfp,
      pfp2: profile.pfp2,
      pfp3: profile.pfp3,
    }),
    [profile.pfp, profile.pfp2, profile.pfp3],
  );

  const hasAllThreePhotos = PHOTO_FIELDS.every((field) => {
    const currentPhoto = previewUrls[field] ?? initialPhotos[field];
    return typeof currentPhoto === "string" && currentPhoto.trim().length > 0;
  });

  return (
    <form
      action={action}
      className="post-form"
      onChange={() => setIsDirty(true)}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setErrorMessage(null);

        for (const field of PHOTO_FIELDS) {
          const file = formData.get(field);
          if (file instanceof File && file.size > MAX_PFP_SIZE_BYTES) {
            setErrorMessage("One of your images is too large. Please upload photos under 10 MB.");
            return;
          }
        }

        const nextPhotosComplete = PHOTO_FIELDS.every((field) => {
          const uploadedFile = formData.get(field);
          if (uploadedFile instanceof File && uploadedFile.size > 0) {
            return true;
          }
          const existingPhoto = previewUrls[field] ?? initialPhotos[field];
          return typeof existingPhoto === "string" && existingPhoto.trim().length > 0;
        });

        if (!nextPhotosComplete) {
          setErrorMessage("Please upload all 3 profile photos before saving.");
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
      <p className="emboss" style={{ textAlign: "center" }}>Photos (3)</p>
      <p style={{ textAlign: "center", margin: "0", color: "var(--color-text-muted)" }}>Upload all three photos to complete your profile.</p>
      <div className="edit-photo-grid" style={{ margin: "var(--space-md) 0" }}>
        {PHOTO_FIELDS.map((field, idx) => (
          <label key={field} htmlFor={field} className="profile-photo-input lifted" style={{ cursor: "pointer" }}>
            <Image
              src={previewUrls[field] ?? initialPhotos[field] ?? "/default-pfp.png"}
              alt={`@${profile.handle} profile photo ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 240px"
              className="profile-photo-input-image"
            />
            <span className="pfp-overlay">Photo {idx + 1}</span>
            <input
              id={field}
              name={field}
              type="file"
              accept="image/*"
              className="invisible"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                if (!file) {
                  return;
                }
                const nextUrl = URL.createObjectURL(file);
                setPreviewUrls((current) => {
                  if (current[field]) URL.revokeObjectURL(current[field]!);
                  return { ...current, [field]: nextUrl };
                });
              }}
            />
          </label>
        ))}
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
      <label className="row" style={{ alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
        <span className="emboss">Private</span>
        <input
          type="checkbox"
          name="isPrivate"
          defaultChecked={profile.private}
          onChange={() => setIsDirty(true)}
        />
      </label>
      <p className="emboss" style={{ textAlign: "left" }}>Links</p>
      <ProfileLinksEditor initialLinks={profileLinks} onEdit={() => setIsDirty(true)} />
      <button
        type="submit"
        className={`btn btnMd ${isDirty ? "lifted" : "sunken"}`}
        disabled={!isDirty || isSaving || !hasAllThreePhotos}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
        {errorMessage ? errorMessage : !hasAllThreePhotos ? "Please upload all 3 profile photos." : isDirty ? "You have unsaved changes." : "All changes saved."}
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
