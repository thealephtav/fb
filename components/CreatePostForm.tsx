"use client";

type Props = {
  canPost: boolean;
  action?: (formData: FormData) => Promise<void>;
  profileHandle?: string;
  profileDisplayName?: string | null;
  disabledMessage?: React.ReactNode;
  isOwner?: boolean;
};

const WAITLIST_URL = "https://thealeph.typeform.com/to/DXE6CRZ0";

export function CreatePostForm({
  canPost,
  action,
  profileHandle,
  isOwner = false,
}: Props) {
  if (!canPost) {
    return (
      <section>
        <p style={{ textAlign: "center" }} className="emboss">
        ·:*¨༺ ♱ <a href="/sign-in">Sign in</a> to post on this profile ♱ ༻¨*:·
        </p>
      </section>
    );
  }

  return (
    <section id="post-form" style={{ scrollMarginTop: "96px" }}>
      <form action={action} className="post-form">
        {profileHandle ? (
          <input type="hidden" name="profileHandle" value={profileHandle} />
        ) : null}
        <div className="post-form-row">
          <input
            id="post-body"
            name="body"
            required
            className="post-input lifted"
            placeholder={isOwner ? "Update status" : "Write a post"}
          />
          <button type="submit" className="emboss floating button-sm">Post</button>
        </div>
        {/* TODO eliminating images from posts for now */}
        {/* <label htmlFor="post-image">Image (optional)</label>
        <input id="post-image" name="image" type="file" accept="image/*" /> */}
      </form>
    </section>
  );
}
