"use client";

import { useMemo, useState } from "react";

type LinkInput = {
  id?: number;
  label: string;
  uri: string;
  click_count?: number;
};

type Props = {
  initialLinks: LinkInput[];
};

type EditableLink = LinkInput & { key: string };

function makeKey(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ProfileLinksEditor({ initialLinks }: Props) {
  const seededLinks = useMemo<EditableLink[]>(
    () => initialLinks.map((link) => ({ ...link, key: makeKey("link") })),
    [initialLinks],
  );
  const [links, setLinks] = useState<EditableLink[]>(seededLinks);

  const updateLink = (key: string, field: "label" | "uri", value: string) => {
    setLinks((prev) =>
      prev.map((link) => (link.key === key ? { ...link, [field]: value } : link)),
    );
  };

  const removeLink = (key: string) => {
    setLinks((prev) => prev.filter((link) => link.key !== key));
  };

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { key: makeKey("link"), label: "", uri: "", click_count: 0 },
    ]);
  };

  return (
    <div className="link-editor">
      {links.map((link, index) => (
        <div key={link.key} className="link-editor-row lifted">
          <div className="link-fields">
            <div>
              <input
                id={`link-label-${index}`}
                name="linkLabel"
                type="text"
                value={link.label}
                onChange={(event) => updateLink(link.key, "label", event.target.value)}
                placeholder="My site"
              />
            </div>
            <div>
              <input
                id={`link-uri-${index}`}
                name="linkUrl"
                type="url"
                value={link.uri}
                onChange={(event) => updateLink(link.key, "uri", event.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="link-meta">
            {/* <span>Hits: {link.click_count ?? 0}</span> */}
            <button type="button" onClick={() => removeLink(link.key)}>
              Delete
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" onClick={addLink}>
          Add link
        </button>
      </div>
    </div>
  );
}
