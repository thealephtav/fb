import type { Metadata } from "next";
import Link from "next/link";
import styles from "./support.module.css";

export const metadata: Metadata = {
  title: "Support | The Aleph",
  description: "Get help with your Aleph account, membership, or app. Contact support, report an issue, or find account deletion information.",
  alternates: {
    canonical: "https://www.thealeph.club/support",
  },
};

export default function SupportPage() {
  return (
    <main className={styles.page}>
      <nav aria-label="Home">
        <Link href="/" className={styles.homeLink}>The Aleph</Link>
      </nav>

      <header className={styles.header}>
        <h1>The Aleph Support</h1>
        <p>For help with your account, membership, or The Aleph app, get in touch.</p>
        <a className={styles.contactLink} href="mailto:support@thealeph.club">
          support@thealeph.club
        </a>
        <p>You can also send a message through our <a href="https://app.thealeph.club/support">support form</a>.</p>
      </header>

      <section className={styles.section} aria-labelledby="account-help">
        <h2 id="account-help">Account and membership help</h2>
        <p>
          Contact us about signing in, invitations, membership access, profiles,
          listings, or messaging. Include the email address associated with your
          account so we can find it.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="technical-issues">
        <h2 id="technical-issues">Report a technical issue</h2>
        <p>To help us understand the problem, please include:</p>
        <ul>
          <li>What happened and what you expected to happen.</li>
          <li>The steps that led to the issue.</li>
          <li>Your device, operating system, and app or browser version.</li>
          <li>A screenshot, if helpful, with any private information removed.</li>
        </ul>
        <p>Please do not send passwords, sign-in codes, or full payment-card details.</p>
      </section>

      <section className={styles.section} aria-labelledby="member-reports">
        <h2 id="member-reports">Report a member or content</h2>
        <p>
          Use the app&apos;s reporting controls where available, or contact support.
          Include the relevant profile, listing, or content link and a brief
          description of your concern. You can also contact us to ask about an
          account restriction or appeal a moderation decision.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="account-deletion">
        <h2 id="account-deletion">Delete your account</h2>
        <p>
          You can permanently delete your account from Settings in the mobile app,
          or by signing in to your <a href="https://app.thealeph.club/account">Account page</a> on
          the web. If you need help accessing your account or completing deletion,
          contact support.
        </p>
        <p>See our <a href="https://app.thealeph.club/privacy">Privacy Policy</a> for details about your data.</p>
      </section>

      <footer className={styles.footer}>
        <nav aria-label="Policies">
          <a href="https://app.thealeph.club/privacy">Privacy Policy</a>
          <a href="https://app.thealeph.club/terms">Terms of Service</a>
        </nav>
        <p>The Aleph Tav Company</p>
      </footer>
    </main>
  );
}
