"use client";

type Props = {
  canPost: boolean;
  action?: (formData: FormData) => Promise<void>;
};

export function CreatePostForm({ canPost, action }: Props) {
  if (!canPost) {
    return (
      <section>
        <h2>Create Post</h2>
        <p>Finish setting up your user before posting.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Create Post</h2>
      <form action={action}>
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
