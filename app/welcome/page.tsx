import Image from "next/image";
import Link from "next/link";
import { WAITLIST_URL } from "@/lib/constants";

type CredibilityLogo = {
  alt: string;
  className: string;
  height: number;
  src: string;
  width: number;
};

const FEATURED_IN: CredibilityLogo[] = [
  { alt: "The New York Times", className: "credential-logo--new-york-times", src: "/credibility/new-york-times.png", width: 320, height: 44 },
  { alt: "Vogue", className: "credential-logo--vogue", src: "/credibility/vogue.png", width: 320, height: 85 },
  { alt: "The New Yorker", className: "credential-logo--new-yorker", src: "/credibility/new-yorker.png", width: 320, height: 75 },
  { alt: "GQ", className: "credential-logo--gq", src: "/credibility/gq.png", width: 320, height: 160 },
  { alt: "The Wall Street Journal", className: "credential-logo--wsj", src: "/credibility/wsj.png", width: 281, height: 160 },
];

const WORK_WITH: CredibilityLogo[] = [
  { alt: "Universal Music Group", className: "credential-logo--universal-music-group", src: "/credibility/universal-music-group.png", width: 320, height: 118 },
  { alt: "Gucci", className: "credential-logo--gucci", src: "/credibility/gucci.png", width: 154, height: 160 },
  { alt: "Nike", className: "credential-logo--nike", src: "/credibility/nike.png", width: 320, height: 112 },
  { alt: "Renault", className: "credential-logo--renault", src: "/credibility/renault.png", width: 128, height: 160 },
  { alt: "Cash App", className: "credential-logo--cash-app", src: "/credibility/cash-app.png", width: 320, height: 71 },
  { alt: "Gemini", className: "credential-logo--gemini", src: "/credibility/gemini.png", width: 640, height: 139 },
];

function CredibilityBand({
  label,
  logos,
}: {
  label: string;
  logos: CredibilityLogo[];
}) {
  return (
    <div className="credential-band">
      <p className="credential-band__label">{label}</p>
      <div className="credential-band__logos">
        {logos.map((logo) => (
          <Image
            className={"credential-logo " + logo.className}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            key={logo.alt}
          />
        ))}
        <span className="credential-band__more">&amp; more</span>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <main className="centered-vert welcome-page">
      <Image className="seal" src="/stamp4.png" alt="Aleph" width={300} height={300} />
      <section className="welcome-actions">
        <Link href={WAITLIST_URL} target="_blank">
          <button className="btn lifted btnLg">Apply for Membership</button>
        </Link>

        <p className="welcome-actions__signin">
          Already have an account? <Link href="https://app.thealeph.club">Sign in</Link>
        </p>
      </section>

      <section className="credentials-bands" aria-label="Member credentials">
        <CredibilityBand label="OUR MEMBERS ARE FEATURED IN" logos={FEATURED_IN} />
        <CredibilityBand label="AND WORK WITH" logos={WORK_WITH} />
      </section>
    </main>
  );
}