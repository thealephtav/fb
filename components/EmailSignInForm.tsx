"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { EmailSignInState, signInWithEmail } from "@/app/actions";
import { WAITLIST_URL } from "@/lib/constants";

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
        className="input input-raised"
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
        className="btn lifted btnMd"
        type="submit"
        disabled={pending || submitState === "pending" || state.status === "sent"}
      >
        {submitState === "pending" ? "Sending..." :
          state.status === "sent" ? "Sent!" :
          state.status === "error" ? "Error" :
        "Send magic link"}
      </button>
      <p style={{ marginTop: "var(--space-sm)", textAlign: "center" }}>
       Not a member? Get on the 
        <a href={WAITLIST_URL} target="_blank" rel="noreferrer" className="emboss">
          {" "}waitlist
        </a>
      </p>
      {state.status === "error" && state.message ? (
        <p style={{ color: "var(--color-text-primary)", marginTop: "var(--space-xs)" }}>{state.message}</p>
      ) : null}
    </form>
  );
}
