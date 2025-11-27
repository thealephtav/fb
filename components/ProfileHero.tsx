"use client";

import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  profileHandle: string;
  profileName: string;
  profilePfp: string | null;
  statusText?: string | null;
  statusUpdatedAt?: string | null;
  showStatus?: boolean;
  children?: ReactNode;
};

export function ProfileHero({
  profileHandle,
  profileName,
  profilePfp,
  statusText,
  statusUpdatedAt,
  showStatus = true,
  children,
}: Props) {
  return (
    <section className="profile-hero-section">
      <div className="profile-avatar lifted">
        {profilePfp ? (
          <Image src={profilePfp} alt={`@${profileHandle} profile picture`} width={96} height={96} />
        ) : (
          <Image src="/default-pfp.png" alt="Default profile" width={96} height={96} />
        )}
      </div>
      <h1 className="profile-handle deboss">{profileName}</h1>
      {showStatus && statusText ? (
        <div className="profile-status">
          <p className="profile-status-body emboss">{statusText}</p>
          {statusUpdatedAt ? (
            <small className="profile-status-label">Status updated at {statusUpdatedAt}</small>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
