"use client";

type Props = {
  canPost: boolean;
  action?: (formData: FormData) => Promise<void>;
  profileHandle?: string | null;
  profileDisplayName?: string | null;
  disabledMessage?: React.ReactNode;
  isOwner?: boolean;
};

const WAITLIST_URL = "https://thealeph.typeform.com/to/DXE6CRZ0";

export function CreatePostForm({
  canPost,
  action,
  profileHandle,
  profileDisplayName,
  disabledMessage,
  isOwner = false,
}: Props) {
  const headerText =
    disabledMessage ??
    (
      <>
        <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
          Get on the waitlist
        </a>{" "}
        or <a href="/sign-in">sign in</a> to post on this profile.
      </>
    );

  if (!canPost) {
    return (
      <section>
        <p>
          <strong>{headerText}</strong>
        </p>
      </section>
    );
  }

  return (
    <section>
      <form action={action} className="post-form">
        {profileHandle ? (
          <input type="hidden" name="profileHandle" value={profileHandle} />
        ) : null}
        <div className="post-form-row">
          <input
            id="post-body"
            name="body"
            required
            className="post-input lifted emboss"
            placeholder={isOwner ? "Update status" : "Write a post"}
          />
          <button type="submit" className="emboss">Post</button>
        </div>
        {/* TODO eliminating images from posts for now */}
        {/* <label htmlFor="post-image">Image (optional)</label>
        <input id="post-image" name="image" type="file" accept="image/*" /> */}
      </form>
    </section>
  );
}
