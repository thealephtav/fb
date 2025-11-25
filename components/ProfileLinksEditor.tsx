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
  onEdit?: () => void;
};

type EditableLink = LinkInput & { key: string };

function makeKey(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ProfileLinksEditor({ initialLinks, onEdit }: Props) {
  const markEdit = () => {
    if (typeof onEdit === "function") onEdit();
  };
  const seededLinks = useMemo<EditableLink[]>(
    () => initialLinks.map((link) => ({ ...link, key: makeKey("link") })),
    [initialLinks],
  );
  const [links, setLinks] = useState<EditableLink[]>(seededLinks);

  const updateLink = (key: string, field: "label" | "uri", value: string) => {
    setLinks((prev) =>
      prev.map((link) => (link.key === key ? { ...link, [field]: value } : link)),
    );
    markEdit();
  };

  const removeLink = (key: string) => {
    setLinks((prev) => prev.filter((link) => link.key !== key));
    markEdit();
  };

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { key: makeKey("link"), label: "", uri: "", click_count: 0 },
    ]);
    markEdit();
  };

  return (
    <div className="link-editor">
      {links.map((link, index) => (
        <div key={link.key} className="link-editor-row lifted">
          <div className="link-row-top">
            <button
              className="link-delete-button emboss"
              type="button"
              onClick={() => removeLink(link.key)}
              aria-label="Delete link"
            >
              ×
            </button>
          </div>
          <div className="link-fields">
            <input
              id={`link-label-${index}`}
              name="linkLabel"
              type="text"
              value={link.label}
              onChange={(event) => updateLink(link.key, "label", event.target.value)}
              placeholder="My site"
              className="profile-link-input input-unstyled"
            />
            <input
              id={`link-uri-${index}`}
              name="linkUrl"
              type="url"
              value={link.uri}
              onChange={(event) => updateLink(link.key, "uri", event.target.value)}
              placeholder="https://example.com"
              className="profile-link-input input-unstyled"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addLink} className="emboss floating">
        {links.length === 0 ? "+ Add a Link" : "+ Add Another Link"}
      </button>
    </div>
  );
}
