"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { EmailSignInState, signUpWithHandle } from "@/app/actions";

export function JoinForm() {
  const [state, formAction] = useActionState<EmailSignInState, FormData>(
    signUpWithHandle,
    { status: "idle" },
  );

  const searchParams = useSearchParams();
  const initialReferralCode = searchParams.get("ref")?.trim() ?? "";
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="post-form join-form">
      <label htmlFor="join-email" className="deboss">Email</label>
      <input
        id="join-email"
        name="email"
        type="email"
        required
        value={state.status === "sent" ? "" : email}
        onChange={(event) => setEmail(event.target.value)}
        className="input input-raised"
      />
      <label htmlFor="join-handle" className="deboss">Username</label>
      <input
        id="join-handle"
        name="handle"
        required
        pattern="[a-z0-9_\-]+"
        title="Use lowercase letters, numbers, underscores, or dashes"
        value={state.status === "sent" ? "" : handle}
        onChange={(event) => setHandle(event.target.value)}
        className="input input-raised"
      />
      <label htmlFor="join-referral-code" className="deboss">Referral Code</label>
      <input
        id="join-referral-code"
        name="referralCode"
        placeholder="abc123"
        value={state.status === "sent" ? "" : referralCode}
        onChange={(event) => setReferralCode(event.target.value)}
        className="input input-raised"
      />
      <button
        type="submit"
        className="btn lifted btnLg"
        disabled={pending || state.status === "sent"}
      >
        {pending
          ? "Sending..."
          : state.status === "sent"
            ? "Sent!"
            : state.status === "error"
              ? "Error"
              : "Join"}
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
