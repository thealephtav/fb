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
        <h2>Create Post</h2>
        <p>{disabledMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Create Post</h2>
      <form action={action}>
        {profileHandle ? (
          <input type="hidden" name="profileHandle" value={profileHandle} />
        ) : null}
        <div>
          <label htmlFor="post-body">Post Text</label>
        </div>
        <div>
          <textarea id="post-body" name="body" required rows={4} />
        </div>
        <div>
          <label htmlFor="post-image">Image (optional)</label>
        </div>
        <div>
          <input id="post-image" name="image" type="file" accept="image/*" />
        </div>
        <button type="submit">Post</button>
      </form>
    </section>
  );
}
