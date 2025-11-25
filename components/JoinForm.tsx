"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
      setReferralCode("");
    }
  }, [state.status, submitState]);

  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim() ?? "";
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

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
        className="input textInput"
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
        className="input textInput"
      />
      <label htmlFor="join-referral-code" className="deboss">Referral Code</label>
      <input
        id="join-referral-code"
        name="referralCode"
        placeholder="abc123"
        value={referralCode}
        onChange={(event) => setReferralCode(event.target.value)}
        className="input textInput"
      />
      <button
        type="submit"
        className="btn lifted btnLg"
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
      {state.status === "sent" ? (
        <p style={{ textAlign: "center" }} className="emboss">Check your email</p>
      ) : state.status === "error" && state.message ? (
        <p style={{ textAlign: "center", color: "var(--color-text-muted)" }} className="emboss">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
