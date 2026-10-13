"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  photos: Array<string | null | undefined>;
  profileHandle: string;
};

const SWIPE_THRESHOLD_PX = 40;

function normalizePhoto(photo: string | null | undefined) {
  return typeof photo === "string" && photo.trim().length > 0 ? photo : "/default-pfp.png";
}

export function ProfilePhotoCarousel({ photos, profileHandle }: Props) {
  const normalizedPhotos = useMemo(() => [normalizePhoto(photos[0]), normalizePhoto(photos[1]), normalizePhoto(photos[2])], [photos]);

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % 3);
  const goPrevious = () => setActiveIndex((prev) => (prev + 2) % 3);

  return (
    <div className="profile-carousel" aria-label={`@${profileHandle} photos`}>
      <div className="profile-carousel-progress" aria-hidden="true">
        {normalizedPhotos.map((_, index) => (
          <div
            key={index}
            className={`profile-carousel-progress-segment ${index === activeIndex ? "is-active" : ""}`}
          />
        ))}
      </div>

      <div
        className="profile-carousel-frame lifted"
        tabIndex={0}
        role="region"
        aria-label="Profile photo carousel"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goNext();
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goPrevious();
          }
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) {
            return;
          }
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const deltaX = endX - touchStartX.current;
          touchStartX.current = null;

          if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
            return;
          }

          if (deltaX > 0) {
            goPrevious();
          } else {
            goNext();
          }
        }}
      >
        <Image
          src={normalizedPhotos[activeIndex]}
          alt={`@${profileHandle} profile photo ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="profile-carousel-image"
          priority
        />
      </div>

      <div className="profile-carousel-controls">
        <button
          type="button"
          className="btn btnSm emboss"
          onClick={goPrevious}
          aria-label="Previous profile photo"
        >
          ‹
        </button>

        <div className="profile-carousel-dots" role="tablist" aria-label="Profile photos">
          {normalizedPhotos.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              className={`profile-carousel-dot ${index === activeIndex ? "is-active" : ""}`}
              aria-selected={index === activeIndex}
              aria-label={`Show profile photo ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn btnSm emboss"
          onClick={goNext}
          aria-label="Next profile photo"
        >
          ›
        </button>
      </div>
    </div>
  );
}
