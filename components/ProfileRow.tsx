"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  href: string;
  name: string | null;
  handle: string;
  pfp?: string | null;
  subText?: string | null;
  body?: string | null;
};

export function ProfileRow({
  href,
  name,
  handle,
  pfp,
  subText,
  body,
}: Props) {
  const displayName = name?.trim() || `@${handle}`;
  return (
    <div className="post-horizontal">
      <div className="post-avatar">
        <Link href={href}>
          <Image
            src={pfp ?? "/default-pfp.png"}
            alt={`@${handle} profile picture`}
            width={64}
            height={64}
          />
        </Link>
      </div>
      <div>
        <p className="post-meta">
          <strong className="emboss">
            <Link href={href}>
              {displayName}
            </Link>

          </strong>{" "}
          {subText ? (
            <small>
              {subText}
            </small>
          ) : null}
        </p>
        {body ? <p className="post-body">{body}</p> : null}
      </div>
    </div>
  );
}
