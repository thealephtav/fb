"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  align?: "space-between" | "center";
};

export function NavBar({ children, align = "space-between" }: Props) {
  return (
    <nav className="navTop" style={{ alignItems: align }}>
      {children}
    </nav>
  );
}
