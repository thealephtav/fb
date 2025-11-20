import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmailSignInForm } from "@/components/EmailSignInForm";

export default async function WelcomePage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>THE ALEPH</h1>
      <EmailSignInForm buttonText="JOIN" layout="inline" />
      <p>
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </main>
  );
}
