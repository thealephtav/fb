import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmailSignInForm } from "@/components/EmailSignInForm";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="centered-vert">
      <h1 className="emboss">Sign in via email</h1>
      <EmailSignInForm />
    </main>
  );
}
