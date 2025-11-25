import Link from "next/link";
import styles from "./demo.module.css";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

export default function DemoPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Component Demo</h1>
        <p>Visual sweep of typography, forms, navigation, and feedback.</p>
        <Link href="/">← Back home</Link>
      </header>

      <div className={styles.gridWrapper}>
        <Section title="Typography">
          <h1>Heading One</h1>
          <h1><strong>Heading One Bold</strong></h1>
          <h1><em>Heading One Italic</em></h1>
          <h2>Heading Two</h2>
          <h2><strong>Heading Two Bold</strong></h2>
          <h2><em>Heading Two Italic</em></h2>
          <h3>Heading Three</h3>
          <h3><strong>Heading Three Bold</strong></h3>
          <h3><em>Heading Three Italic</em></h3>
          <p>Default paragraph with <strong>strong</strong>, <em>emphasis</em>, <code>code</code>, <kbd>⌘K</kbd>, and <Link href="/demo">links</Link>.</p>
          <small>Small helper text.</small>
          <p style={{ fontSize: "1.2rem" }}>Large paragraph sizing for emphasis.</p>
          <blockquote>“Blockquote default styling for pull quotes.”</blockquote>
          <blockquote>“Blockquote with citation.” <cite>— Someone</cite></blockquote>
          <ul>
            <li>Unordered item</li>
            <li>Another item</li>
            <li>
              Nested list
              <ul>
                <li>Child item</li>
              </ul>
            </li>
          </ul>
          <ol>
            <li>Ordered item</li>
            <li>Second item</li>
          </ol>
        </Section>

        <Section title="Color + Tokens">
          <div className={styles.row}>
            <div className={styles.swatch} style={{ background: "var(--color-primary, #dfe6ff)" }}>Primary</div>
            <div className={styles.swatch} style={{ background: "var(--color-secondary, #e6dfff)" }}>Secondary</div>
            <div className={styles.swatch} style={{ background: "#e7f7e9" }}>Success</div>
            <div className={styles.swatch} style={{ background: "#fff6e5" }}>Warning</div>
            <div className={styles.swatch} style={{ background: "#fde7e7" }}>Danger</div>
            <div className={styles.swatch} style={{ background: "#f4f4f4" }}>Neutral</div>
          </div>
          <div className={styles.row}>
            <div className={styles.swatch} style={{ background: "linear-gradient(135deg, #8ec5ff, #5a7bff)" }}>Primary Gradient</div>
            <div className={styles.swatch} style={{ background: "linear-gradient(135deg, #f8c4ff, #c0a4ff)" }}>Accent Gradient</div>
          </div>
          <div className={styles.row}>
            <div className={styles.swatch}>Shadow/Emboss</div>
            <div className={styles.swatch}>Inset</div>
          </div>
          <div className={styles.spacingScale}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className={styles.spacingBox} style={{ padding: `${n * 4}px` }}>
                {`Spacing ${n}`}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons">
          <div className={styles.row}>
            <button className={`emboss lifted ${styles.btnLg}`}>Enabled</button>
            <button className={`sunken ${styles.btnLg}`} disabled>Disabled</button>
            <button className={`${styles.iconButton} emboss lifted ${styles.btnSm}`}>★</button>
            <div className={styles.buttonGroup}>
              <button className={`emboss lifted ${styles.btnMd}`}>Left Md</button>
              <button className={`emboss lifted ${styles.btnMd}`}>Middle Md</button>
              <button className={`emboss lifted ${styles.btnMd}`}>Right Md</button>
            </div>
          </div>
        </Section>

        <Section title="Inputs">
          <div className={styles.column}>
            <input className="post-input lifted" placeholder="Text input" />
            <input className="post-input lifted" placeholder="Invalid input" aria-invalid />
            <input className="post-input sunken" placeholder="Disabled input" disabled />
            <textarea className="post-input lifted" rows={2} placeholder="Textarea" />
            <select className="post-input lifted" defaultValue="one">
              <option value="one">Select option</option>
              <option value="two">Another</option>
            </select>
            <label style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>
              <input type="checkbox" defaultChecked /> Checkbox
            </label>
            <label style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>
              <input type="checkbox" className="sunken" disabled /> Checkbox disabled
            </label>
            <label style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>
              <input type="radio" name="demo-radio" defaultChecked /> Radio
            </label>
            <label style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>
              <input type="radio" name="demo-radio" /> Radio unchecked
            </label>
            <label style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>
              Toggle <input type="checkbox" role="switch" className="sunken" />
            </label>
            <input type="range" min="0" max="100" defaultValue="40" className="sunken" />
            <div className="post-form-row">
              <span style={{ padding: "0.5rem" }}>🔍</span>
              <input className="post-input lifted" placeholder="Search" />
            </div>
            <div className="post-form-row">
              <span style={{ padding: "0.5rem" }}>http://</span>
              <input className="post-input lifted" placeholder="example.com" />
              <span style={{ padding: "0.5rem" }}>.com</span>
            </div>
          </div>
        </Section>

        <Section title="Cards">
          <div className={styles.row}>
            <div className={styles.card}>
              <h4>Basic card</h4>
              <p>Body copy goes here.</p>
            </div>
            <div className={`${styles.card} lifted`}>
              <h4>Elevated card</h4>
              <p>Shadowed surface.</p>
            </div>
            <div className={`${styles.card} sunken`}>
              <h4>Inset card</h4>
              <p>Embossed style.</p>
            </div>
            <div className={styles.card}>
              <header>Header</header>
              <p>Body</p>
              <footer>Footer</footer>
            </div>
            <div className={`${styles.card} lifted`}>
              <div className={styles.media} />
              <p>Media card copy</p>
            </div>
          </div>
        </Section>

        <Section title="Navigation">
          <nav className={styles.navTop}>
            <span>Logo</span>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="#">Home</Link>
              <Link href="#">About</Link>
              <Link href="#">Contact</Link>
            </div>
          </nav>
          <div className={styles.row}>
            <aside className={`${styles.navSide} lifted`}>
              <Link href="#">Item One</Link>
              <Link href="#">Item Two</Link>
              <Link href="#">Item Three</Link>
            </aside>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button className="emboss">Tab 1</button>
              <button className="emboss">Tab 2</button>
              <button className="emboss" disabled>Tab 3</button>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.breadcrumb}>
              <Link href="#">Home</Link> / <Link href="#">Library</Link> / <span>Data</span>
            </div>
            <div className={styles.pagination}>
              <button>«</button>
              <button>‹</button>
              <button>1</button>
              <button>2</button>
              <button>›</button>
              <button>»</button>
            </div>
          </div>
        </Section>

        <Section title="Alerts + Feedback">
          <div className={styles.column}>
            <div className={`${styles.swatch} ${styles.alert} ${styles.success}`}>Success alert</div>
            <div className={`${styles.swatch} ${styles.alert} ${styles.warning}`}>Warning alert</div>
            <div className={`${styles.swatch} ${styles.alert} ${styles.danger}`}>Danger alert</div>
            <div className={`${styles.swatch} ${styles.alert} ${styles.info}`}>Info alert</div>
            <div className={styles.toast}>Toast notification</div>
            <div className={styles.progress}>
              <div className={styles.progressBar} style={{ width: "60%" }} />
            </div>
            <div className={`${styles.progress} ${styles.indeterminate}`} />
            <div className={`${styles.skeleton} ${styles.card}`} />
          </div>
        </Section>

        <Section title="Modals + Overlays">
          <div className={styles.row}>
            <div className={styles.card} style={{ minWidth: "200px" }}>
              <header>Modal Header</header>
              <p>Modal body copy.</p>
              <footer><button className="emboss">Close</button></footer>
            </div>
            <div className={styles.drawer} style={{ minWidth: "140px" }}>Drawer content</div>
            <div className={styles.tooltip}>Tooltip</div>
            <div className={styles.popover}>Popover</div>
            <div className={styles.backdrop}>Backdrop</div>
          </div>
        </Section>

        <Section title="Media & Misc">
          <div className={styles.row}>
            <div className={`${styles.avatar} ${styles.small}`} />
            <div className={`${styles.avatar} ${styles.medium}`} />
            <div className={`${styles.avatar} ${styles.large}`} />
            <span className={styles.badge}>Badge</span>
            <span className={styles.chip}>Chip ✕</span>
            <details className={styles.accordion}>
              <summary>Accordion</summary>
              <p>Accordion content</p>
            </details>
            <table className={styles.table}>
              <thead>
                <tr><th>Header</th><th>Sortable</th></tr>
              </thead>
              <tbody>
                <tr><td>Row 1</td><td>A</td></tr>
                <tr><td>Row 2</td><td>B</td></tr>
              </tbody>
            </table>
            <div className={styles.dividerHorizontal} />
          </div>
        </Section>
{/* 
        <Section title="Layout Primitives">
          <div className={styles.gridExample}>
            <div className={styles.swatch}>2-col</div>
            <div className={styles.swatch}>2-col</div>
          </div>
          <div className={`${styles.gridExample} ${styles.three}`}>
            <div className={styles.swatch}>3-col</div>
            <div className={styles.swatch}>3-col</div>
            <div className={styles.swatch}>3-col</div>
          </div>
          <div className={styles.flexRow}>
            <div className={styles.swatch}>Flex row A</div>
            <div className={styles.swatch}>Flex row B</div>
          </div>
          <div className={styles.flexCol}>
            <div className={styles.swatch}>Flex col A</div>
            <div className={styles.swatch}>Flex col B</div>
          </div>
        </Section> */}

        <Section title="Special Effects">
          <div className={styles.row}>
            <div className={styles.swatch}>Embossed</div>
            <div className={styles.swatch}>Shadow depth</div>
            <div className={styles.swatch} style={{ outline: "2px solid var(--color-border, #ccc)" }}>Focus ring</div>
            <div className={styles.swatch} style={{ opacity: 0.5 }}>Disabled</div>
            <div className={styles.swatch} style={{ border: "1px solid var(--color-danger, #c33)" }}>Error state</div>
          </div>
        </Section>
      </div>
    </main>
  );
}
