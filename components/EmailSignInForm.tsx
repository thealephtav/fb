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
    >
      <label htmlFor="email">{label}</label>
      <input
        className="post-input lifted emboss"
        id="email"
        name="email"
        type="email"
        required
        style={{ 
          marginBottom: "var(--space-sm)",
          width: "calc(100% - calc(var(--space-sm) * 2))",
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
    </form>
  );
}
