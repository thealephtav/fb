"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { EmailSignInState, signInWithEmail } from "@/app/actions";

type Props = {
  buttonText?: string;
  label?: string;
  layout?: "stacked" | "inline";
};

export function EmailSignInForm({
  buttonText = "Send magic link",
  label = "Email",
  layout = "stacked",
}: Props) {
  const [state, handleAction] = useActionState<EmailSignInState, FormData>(
    signInWithEmail,
    { status: "idle" },
  );
  // TODO Quick optimistic state so the UI shows "Sending" immediately; ideally this
  // should be managed via useFormStatus or a shared toast system in the future.
  const [submitState, setSubmitState] = useState<"idle" | "pending">("idle");
  const { pending } = useFormStatus();

  useEffect(() => {
    if (submitState === "pending" && state.status !== "idle") {
      setSubmitState("idle");
    }
  }, [state.status, submitState]);

  const input = (
    <input
      id="email"
      name="email"
      type="email"
      required
      style={layout === "inline" ? { flex: 1 } : undefined}
    />
  );

  return (
    <form
      action={handleAction}
      onSubmit={() => {
        setSubmitState("pending");
      }}
    >
      <div>
        <label htmlFor="email">{label}</label>
      </div>
      {layout === "inline" ? (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {input}
          <button type="submit" disabled={pending || submitState === "pending"}>
            {submitState === "pending" ? "Sending..." : buttonText}
          </button>
        </div>
      ) : (
        <>
          <div>{input}</div>
          <button type="submit" disabled={pending || submitState === "pending"}>
            {submitState === "pending" ? "Sending..." : buttonText}
          </button>
        </>
      )}
      {submitState === "pending" ? (
        <p>Sending magic link...</p>
      ) : state.status === "sent" ? (
        <p>{state.message ?? "Email sent! Check your inbox."}</p>
      ) : state.status === "error" ? (
        <p>{state.message ?? "Something went wrong."}</p>
      ) : null}
    </form>
  );
}
