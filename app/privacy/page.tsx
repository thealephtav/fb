import type { Metadata } from "next";
import Link from "next/link";
import styles from "../support/support.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | The Aleph",
  description: "Learn how The Aleph collects, uses, shares, and protects information.",
  alternates: {
    canonical: "https://www.thealeph.club/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <nav aria-label="Home">
        <Link href="/" className={styles.homeLink}>The Aleph</Link>
      </nav>

      <header className={styles.header}>
        <h1>Privacy Policy</h1>
        <p>Last updated: November 21, 2026</p>
        <p>
          This Privacy Policy explains how The Aleph Tav Company
          (&ldquo;The Aleph,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) collects, uses, and shares information when you
          use the Aleph website, web application, and mobile application
          (together, the &ldquo;Service&rdquo;).
        </p>
      </header>

      <section className={styles.section} aria-labelledby="information-we-collect">
        <h2 id="information-we-collect">Information we collect</h2>
        <p>
          <strong>Account and profile information.</strong> When you create or
          manage an account, we collect the information you provide, such as
          your email address, username, display name, profile image, account
          privacy settings, and links you add to your profile. We also process
          sign-in, verification, and session information so you can securely
          access your account.
        </p>
        <p>
          <strong>Content and activity.</strong> We collect content and
          information you create or share through the Service, such as profile
          information, posts, images, listings, messages, referrals, follows,
          and other interactions with members or features of the Service.
        </p>
        <p>
          <strong>Support communications.</strong> If you contact us, we
          collect the information in your request and our correspondence with
          you.
        </p>
        <p>
          <strong>Technical and usage information.</strong> We and our service
          providers may receive limited technical information when you use the
          Service, such as device and browser information, IP address, pages or
          features used, and diagnostic or analytics information.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="how-we-use-information">
        <h2 id="how-we-use-information">How we use information</h2>
        <p>We use information to:</p>
        <ul>
          <li>Provide, maintain, and secure the Service and your account.</li>
          <li>
            Enable member profiles, connections, messages, listings, referrals,
            and other community features.
          </li>
          <li>Communicate with you about sign-in, support, and the Service.</li>
          <li>
            Understand and improve the Service, including through usage
            analytics.
          </li>
          <li>
            Protect members, investigate misuse, and comply with legal
            obligations.
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="how-we-share-information">
        <h2 id="how-we-share-information">How information is shared</h2>
        <p>
          The Aleph is built for connection. Information you make available in
          your profile or through community features may be visible to other
          members or people who can access the relevant page, according to your
          settings and the feature you use. Messages are visible to their
          intended recipients. Please consider this before posting or sharing
          information.
        </p>
        <p>
          We also share information with vendors that help us operate the
          Service, including providers of hosting, data storage, email delivery,
          authentication, media storage, and analytics. These providers may
          process information on our behalf to provide their services to us.
        </p>
        <p>
          We may disclose information when reasonably necessary to comply with
          law, enforce our agreements, protect the security of the Service or
          its users, or in connection with a corporate transaction such as a
          financing, acquisition, or sale of assets.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="your-choices">
        <h2 id="your-choices">Your choices and account deletion</h2>
        <p>
          You can update your profile and the information you choose to share
          through the Service. You can permanently delete your account from
          Settings in the mobile app or from the web <a href="https://app.thealeph.club/account">Account page</a>.
          If you cannot access your account, email <a href="mailto:support@thealeph.club">support@thealeph.club</a> for
          help.
        </p>
        <p>
          You may also contact us with a request to access, correct, or delete
          personal information, subject to applicable law. We may need to
          verify your identity before responding.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="retention">
        <h2 id="retention">Data retention</h2>
        <p>
          We retain information for as long as needed to provide the Service,
          maintain security, resolve disputes, and meet legal or operational
          requirements. When you delete your account, we delete or de-identify
          associated information within our active systems, except where we
          need to retain limited information for those purposes. Residual copies
          may remain in backups for a limited period.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="security">
        <h2 id="security">Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational
          measures designed to protect information. No method of transmission
          or storage is completely secure, so we cannot guarantee absolute
          security.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="children">
        <h2 id="children">Children</h2>
        <p>
          The Service is not directed to children under 13, and we do not
          knowingly collect personal information from children under 13. If you
          believe a child has provided us personal information, contact us and
          we will take appropriate steps.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="changes">
        <h2 id="changes">Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the
          updated version here and revise the &ldquo;Last updated&rdquo; date.
          If a change is material, we may provide additional notice where
          required.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="contact-us">
        <h2 id="contact-us">Contact us</h2>
        <p>
          Questions or requests about this policy can be sent to <a href="mailto:support@thealeph.club">support@thealeph.club</a>.
        </p>
        <p>The Aleph Tav Company</p>
      </section>

      <footer className={styles.footer}>
        <nav aria-label="Help">
          <Link href="/support">Support</Link>
          <Link href="/">Home</Link>
        </nav>
      </footer>
    </main>
  );
}
