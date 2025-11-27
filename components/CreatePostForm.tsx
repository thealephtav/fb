"use client";

// TODO these props are insane
type Props = {
  canPost: boolean;
  action?: (formData: FormData) => Promise<void>;
  profileHandle?: string;
  profileDisplayName?: string | null;
  disabledMessage?: React.ReactNode;
  isOwner?: boolean;
  buttonText?: string;
  placeholderText?: string;
};

export function CreatePostForm({
  canPost,
  action,
  profileHandle,
  buttonText = "Post",
  placeholderText = "Write a post",
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
            className="input input-raised"
            placeholder={placeholderText}
          />
          <button type="submit" className="btn btnMd lifted">{buttonText}</button>
        </div>
      </form>
    </section>
  );
}
