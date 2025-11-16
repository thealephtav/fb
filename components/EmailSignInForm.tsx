"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { EmailSignInState, signInWithEmail } from "@/app/actions";

export function EmailSignInForm() {
  const { pending } = useFormStatus();
  const [state, formAction] = useActionState<EmailSignInState, FormData>(
    signInWithEmail,
    { status: "idle" },
  );

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">Email</label>
      </div>
      <div>
        <input id="email" name="email" type="email" required />
      </div>
      <button type="submit" disabled={pending}>
        Send magic link
      </button>
      { pending ?
          <p>Sending magic link...</p> :
        state.status === "sent" ?
          <p>{state.message ?? "Email sent! Check your inbox."}</p> :
        state.status === "error" ?
          <p>{state.message ?? "Something went wrong."}</p> :
          null
      }
    </form>
  );
}
