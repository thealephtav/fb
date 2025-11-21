"use client";

type Props = {
  canPost: boolean;
  action?: (formData: FormData) => Promise<void>;
  profileHandle?: string | null;
  disabledMessage?: string;
};

export function CreatePostForm({
  canPost,
  action,
  profileHandle,
  disabledMessage = "Finish setting up your user before posting.",
}: Props) {
  if (!canPost) {
    return (
      <section>
        <h2>
          {profileHandle ? `Write on @${profileHandle}'s wall` : "Create Post"}
        </h2>
        <p>{disabledMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <h2>{profileHandle ? `Write on @${profileHandle}'s wall` : "Create Post"}</h2>
      <form action={action} className="post-form">
        {profileHandle ? (
          <input type="hidden" name="profileHandle" value={profileHandle} />
        ) : null}
        <label htmlFor="post-body">Message</label>
        <div className="post-form-row">
          <input id="post-body" name="body" required className="post-input" />
          <button type="submit">Post</button>
        </div>
        <label htmlFor="post-image">Image (optional)</label>
        <input id="post-image" name="image" type="file" accept="image/*" />
      </form>
    </section>
  );
}
