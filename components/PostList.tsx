import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/data";

type Props = {
  posts: Post[];
  emptyMessage?: string;
};

export function PostList({ posts, emptyMessage = "No posts yet." }: Props) {
  if (posts.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post">
          <div className="post-header">
            {post.author_pfp ? (
              <Image
                src={post.author_pfp}
                alt={post.author_handle ? `@${post.author_handle}` : "Author"}
                width={48}
                height={48}
              />
            ) : (
              <span>👤</span>
            )}
            <div>
              {post.author_handle ? (
                <Link href={`/u/${post.author_handle}`}>@{post.author_handle}</Link>
              ) : (
                <span>{post.author_name ?? "Unknown"}</span>
              )}
              <small>{new Date(post.posted_at).toLocaleString()}</small>
            </div>
          </div>
          <p>{post.body}</p>
          {post.image_url ? (
            <Image src={post.image_url} alt="Post image" width={100} height={100} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
