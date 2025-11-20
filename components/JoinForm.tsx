"use client";

import { useActionState, useState } from "react";
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

  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");

  const handleAction = async (formData: FormData) => {
    setSubmitState("pending");
    const result = await formAction(formData);
    setSubmitState("idle");
    if (result?.status === "sent") {
      setEmail("");
      setHandle("");
    }
  };

  return (
    <form
      action={handleAction}
      onSubmit={() => {
        setSubmitState("pending");
      }}
    >
      <label htmlFor="join-email">Email</label>
      <input
        id="join-email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label htmlFor="join-handle">Username</label>
      <input
        id="join-handle"
        name="handle"
        required
        pattern="[a-z0-9_\-]+"
        title="Use lowercase letters, numbers, underscores, or dashes"
        value={handle}
        onChange={(event) => setHandle(event.target.value)}
      />
      <button type="submit" disabled={pending || submitState === "pending"}>
        {submitState === "pending" ? "Sending..." : "JOIN"}
      </button>
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
