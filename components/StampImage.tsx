"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, ThemePreference } from "@/lib/theme";

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "light" || value === "dark";

const getCurrentTheme = (): ThemePreference => {
  if (typeof document === "undefined") return "light";
  const fromDataset = document.documentElement.dataset.theme;
  if (isThemePreference(fromDataset)) return fromDataset;
  const stored = typeof window !== "undefined" ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
  if (isThemePreference(stored)) return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function StampImage() {
  const [theme, setTheme] = useState<ThemePreference>("light");

  useEffect(() => {
    setTheme(getCurrentTheme());

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && isThemePreference(event.newValue)) {
        setTheme(event.newValue);
      }
    };

    const onCustomChange = (event: Event) => {
      const detail = (event as CustomEvent<ThemePreference>).detail;
      if (isThemePreference(detail)) {
        setTheme(detail);
      } else {
        setTheme(getCurrentTheme());
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("aleph-theme-change", onCustomChange as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("aleph-theme-change", onCustomChange as EventListener);
    };
  }, []);

  const src = theme === "dark" ? "/stamp-dark.png" : "/stamp.png";

  return <Image className="seal" src={src} alt="Aleph" width={300} height={200} />;
}
