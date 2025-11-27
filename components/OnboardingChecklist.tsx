"use client";

import Link from "next/link";

type Item = {
  label: string;
  href: string;
  done: boolean;
};

type Props = {
  items: Item[];
};

export function OnboardingChecklist({ items }: Props) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      className="emboss lifted"
      style={{
        padding: "1.5rem 1rem 1rem 2.2rem",
        background: "repeating-linear-gradient(to bottom, var(--color-warning), var(--color-warning) 28px, #fbeec0 28px, #fbeec0 30px)",
        borderRadius: "4px",
        border: "2px solid #e4bf64",
        position: "relative",
      }}
    >
      {/* Simulate notebook margin */}
      <div
        style={{
          position: "absolute",
          left: "1.15rem",
          top: "0.9rem",
          width: "2px",
          height: "calc(100% - 1.8rem)",
          background: "rgba(180, 80, 80, 0.32)",
          borderRadius: "3px",
        }}
      />
      <h3
        style={{
          marginTop: 0,
          marginBottom: "0.5rem",
          color: "#5b462c",
          textShadow: "none",
        }}
      >
        Onboarding checklist
      </h3>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {items.map((item, idx) => (
          <li
            key={item.label}
            style={{
              borderBottom: idx < items.length - 1 ? "1.5px dashed #ceb263" : "none",
            }}
          >
            <Link
              href={item.href}
              style={{
                textDecoration: item.done
                  ? "line-through #adadad"
                  : "none",
                textShadow: item.done
                  ? "none"
                  : "1px 1px 0 #fffbe7",
                cursor: item.done ? "default" : "pointer",
                color: item.done ? "var(--color-text-muted)" : "var(--color-link)",
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
