import Image from "next/image";
import Link from "next/link";
import { WAITLIST_URL, BLOG_URL } from "@/lib/constants";

export default function WelcomePage() {
  return (
    <main className="centered-vert">
      <Image className="seal" src="/stamp4.png" alt="Aleph" width={300} height={300} />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "var(--size-main-max)",
          alignItems: "center",
        }}
      >
        <Link href={WAITLIST_URL} target="_blank">
          <button className="btn lifted btnLg">Get on the List</button>
        </Link>
        <Link href={BLOG_URL} target="_blank">
          <button className="btn lifted btnLg">Writing</button>
        </Link>
        <hr style={{ width: "100%" }} />
        <p style={{ textAlign: "center", marginTop: "0" }}>
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
