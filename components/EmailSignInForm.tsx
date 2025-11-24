"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { EmailSignInState, signInWithEmail } from "@/app/actions";

type Props = {
  label?: string;
};

export function EmailSignInForm({
  label = "Email",
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

  return (
    <form
      action={handleAction}
      onSubmit={() => {
        setSubmitState("pending");
      }}
      className="post-form join-form"
    >
      <label htmlFor="email">{label}</label>
      <input
        className="post-input"
        id="email"
        name="email"
        type="email"
        required
        style={{
          width: "100%",
          marginBottom: "var(--space-sm)",
          boxSizing: "border-box",
        }}
      />
      <button
        className="emboss floating"
        type="submit"
        disabled={pending || submitState === "pending" || state.status === "sent"}
      >
        {submitState === "pending" ? "Sending..." :
          state.status === "sent" ? "Sent!" :
          state.status === "error" ? "Error" :
        "Send magic link"}
      </button>
      {state.status === "error" && state.message ? (
        <p style={{ color: "var(--color-text-primary)", marginTop: "var(--space-xs)" }}>{state.message}</p>
      ) : null}
    </form>
  );
}
