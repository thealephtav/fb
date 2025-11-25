import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h2 className="sectionTitle">{title}</h2>
      <div className="sectionBody">{children}</div>
    </section>
  );
}

export default function DemoPage() {
  return (
    <main className="page">
      <header className="header">
        <h1>Component Demo</h1>
        <p>Visual sweep of typography, forms, navigation, and feedback.</p>
        <Link href="/">← Back home</Link>
      </header>

      <div className="gridWrapper">
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
          <div className="serif">
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
          </div>
        </Section>

        <Section title="Color + Tokens">
          <div className="row">
            <div className="swatch" style={{ background: "var(--color-success)" }}>Success</div>
            <div className="swatch" style={{ background: "var(--color-warning)" }}>Warning</div>
            <div className="swatch" style={{ background: "var(--color-danger)" }}>Danger</div>
            <div className="swatch" style={{ background: "var(--color-info)" }}>Info</div>
          </div>
          <div className="row">
            <div className="swatch floating">Floating</div>
            <div className="swatch sunken">Sunken/Disabled</div>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="row">
            <button className="btn lifted btnLg">Enabled</button>
            <button className="btn sunken btnLg" disabled>Disabled</button>
            <button className="btn iconButton lifted btnSm">★</button>
            <div className="buttonGroup">
              <button className="btn lifted btnMd">Left Md</button>
              <button className="btn lifted btnMd">Middle Md</button>
              <button className="btn lifted btnMd">Right Md</button>
            </div>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="column">
            <input className="textInput" placeholder="Text input" />
            <input
              className="textInput"
              placeholder="Invalid input"
              aria-invalid
              required
              pattern="[A-Z]{3,}"
              defaultValue="bad"
            />
            <input className="textInput" placeholder="Disabled input" disabled />
            <textarea className="textInput" rows={2} placeholder="Textarea" />
            <select className="textInput" defaultValue="one">
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
              <input className="textInput" placeholder="Search" />
            </div>
            <div className="post-form-row">
              <span style={{ padding: "0.5rem" }}>http://</span>
              <input className="textInput" placeholder="example.com" />
              <span style={{ padding: "0.5rem" }}>.com</span>
            </div>
          </div>
        </Section>

        <Section title="Cards">
          <div className="row">
            <div className="card">
              <h4>Basic card</h4>
              <p>Body copy goes here.</p>
            </div>
            <div className="card lifted">
              <h4>Elevated card</h4>
              <p>Shadowed surface.</p>
            </div>
            <div className="card sunken">
              <h4>Inset card</h4>
              <p>Embossed style.</p>
            </div>
            <div className="card">
              <header>Header</header>
              <p>Body</p>
              <footer>Footer</footer>
            </div>
            <div className="card lifted">
              <div className="media" />
              <p>Media card copy</p>
            </div>
          </div>
        </Section>

        <Section title="Navigation">
          <nav className="navTop">
            <span>Logo</span>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="#">Home</Link>
              <Link href="#">About</Link>
              <Link href="#">Contact</Link>
            </div>
          </nav>
          <div className="row">
            <aside className="navSide lifted">
              <Link href="#">Item One</Link>
              <Link href="#">Item Two</Link>
              <Link href="#">Item Three</Link>
            </aside>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button className="btn">Tab 1</button>
              <button className="btn">Tab 2</button>
              <button className="btn sunken" disabled>Tab 3</button>
            </div>
          </div>
          <div className="row">
            <div className="breadcrumb">
              <Link href="#">Home</Link> / <Link href="#">Library</Link> / <span>Data</span>
            </div>
            <div className="pagination">
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
          <div className="column">
            <div className="swatch alert success">Success alert</div>
            <div className="swatch alert warning">Warning alert</div>
            <div className="swatch alert danger">Danger alert</div>
            <div className="swatch alert info">Info alert</div>
            <div className="toast">Toast notification</div>
            <div className="progress">
              <div className="progressBar" style={{ width: "60%" }} />
            </div>
            <div className="progress indeterminate" />
            <div className="skeleton card" />
          </div>
        </Section>

        <Section title="Modals + Overlays">
          <div className="row">
            <div className="card" style={{ minWidth: "200px" }}>
              <header>Modal Header</header>
              <p>Modal body copy.</p>
              <footer><button className="btn">Close</button></footer>
            </div>
            <div className="drawer" style={{ minWidth: "140px" }}>Drawer content</div>
            <div className="tooltip">Tooltip</div>
            <div className="popover">Popover</div>
            <div className="backdrop">Backdrop</div>
          </div>
        </Section>

        <Section title="Media & Misc">
          <div className="row">
            <div className="avatar small" />
            <div className="avatar medium" />
            <div className="avatar large" />
            <span className="badge">Badge</span>
            <span className="chip">Chip ✕</span>
            <details className="accordion">
              <summary>Accordion</summary>
              <p>Accordion content</p>
            </details>
            <table className="table">
              <thead>
                <tr><th>Header</th><th>Sortable</th></tr>
              </thead>
              <tbody>
                <tr><td>Row 1</td><td>A</td></tr>
                <tr><td>Row 2</td><td>B</td></tr>
              </tbody>
            </table>
            <div className="dividerHorizontal" />
          </div>
        </Section>

        <Section title="Layout Primitives">
          <div className="gridExample">
            <div className="swatch">2-col</div>
            <div className="swatch">2-col</div>
          </div>
          <div className="gridExample three">
            <div className="swatch">3-col</div>
            <div className="swatch">3-col</div>
            <div className="swatch">3-col</div>
          </div>
          <div className="flexRow">
            <div className="swatch">Flex row A</div>
            <div className="swatch">Flex row B</div>
          </div>
          <div className="flexCol">
            <div className="swatch">Flex col A</div>
            <div className="swatch">Flex col B</div>
          </div>
        </Section>

        <Section title="Special Effects">
          <div className="row">
            <div className="swatch">Embossed</div>
            <div className="swatch">Shadow depth</div>
            <div className="swatch" style={{ borderRadius: "4px" }}>Radius sm</div>
            <div className="swatch" style={{ borderRadius: "12px" }}>Radius lg</div>
            <div className="swatch" style={{ outline: "2px solid var(--color-border, #ccc)" }}>Focus ring</div>
            <div className="swatch" style={{ opacity: 0.5 }}>Disabled</div>
            <div className="swatch" style={{ border: "1px solid var(--color-danger, #c33)" }}>Error state</div>
          </div>
        </Section>
      </div>
    </main>
  );
}
