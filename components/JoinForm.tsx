"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { EmailSignInState, signUpWithHandle } from "@/app/actions";

export function JoinForm() {
  const [state, formAction] = useActionState<EmailSignInState, FormData>(
    signUpWithHandle,
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
    if (state.status === "sent") {
      setEmail("");
      setHandle("");
    }
  }, [state.status, submitState]);

  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");

  return (
    <form
      action={formAction}
      onSubmit={() => {
        setSubmitState("pending");
      }}
      className="post-form join-form"
    >
      <label htmlFor="join-email" className="deboss">Email</label>
      <input
        id="join-email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="post-input"
      />
      <label htmlFor="join-handle" className="deboss">Username</label>
      <input
        id="join-handle"
        name="handle"
        required
        pattern="[a-z0-9_\-]+"
        title="Use lowercase letters, numbers, underscores, or dashes"
        value={handle}
        onChange={(event) => setHandle(event.target.value)}
        className="post-input"
      />
      <button
        type="submit"
        className="emboss floating"
        disabled={pending || submitState === "pending" || state.status === "sent"}
      >
        {submitState === "pending"
          ? "Sending..."
          : state.status === "sent"
            ? "Sent!"
            : state.status === "error"
              ? "Error"
              : "JOIN"}
      </button>
    </form>
  );
}
