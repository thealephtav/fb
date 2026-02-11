"use client";

import { ReactNode } from "react";
import { ProfilePhotoCarousel } from "@/components/ProfilePhotoCarousel";

type Props = {
  profileHandle: string;
  profileName: string;
  profilePfp: string | null;
  profilePfp2?: string | null;
  profilePfp3?: string | null;
  statusText?: string | null;
  statusUpdatedAt?: string | null;
  showStatus?: boolean;
  children?: ReactNode;
};

export function ProfileHero({
  profileHandle,
  profileName,
  profilePfp,
  profilePfp2,
  profilePfp3,
  statusText,
  statusUpdatedAt,
  showStatus = true,
  children,
}: Props) {
  return (
    <section className="profile-hero-section">
      <ProfilePhotoCarousel photos={[profilePfp, profilePfp2, profilePfp3]} profileHandle={profileHandle} />
      <div>
        <h1 className="profile-handle deboss">{profileName}</h1>
        {showStatus && statusText ? (
          <div className="profile-status">
            <p className="profile-status-body emboss">{statusText}</p>
            {statusUpdatedAt ? (
              <small className="profile-status-label">Status updated at {statusUpdatedAt}</small>
            ) : null}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
