import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmailSignInForm } from "@/components/EmailSignInForm";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Sign in via email</h1>
      <EmailSignInForm />
      <p>
        Need an invite? <Link href="/welcome">Join here</Link>
      </p>
    </main>
  );
}
