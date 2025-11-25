import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/data";

type Props = {
  posts: Post[];
  emptyMessage?: string;
  statusHandle?: string;
};

function formatDayLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return "Today";
  }
  if (isYesterday) {
    return "Yesterday";
  }
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export function PostList({ posts, emptyMessage = "No posts yet.", statusHandle }: Props) {
  if (posts.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  const postsByDay = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const label = formatDayLabel(new Date(post.posted_at));
    acc[label] = acc[label] ? [...acc[label], post] : [post];
    return acc;
  }, {});

  const orderedLabels = posts.reduce<string[]>((labels, post) => {
    const label = formatDayLabel(new Date(post.posted_at));
    if (!labels.includes(label)) {
      labels.push(label);
    }
    return labels;
  }, []);

  return (
    <div>
      {orderedLabels.map((label, index) => (
        <section key={label} className="post-day">
          {index > 0 ? <hr /> : null}
          <h3 className="emboss">{label}</h3>
          <ul className="post-list">
            {postsByDay[label].map((post) => (
              <li key={post.id} className="post-item">
                <div className="post-horizontal">
                  <div className="post-avatar">
                    {post.author_handle ? (
                      <Link href={`/${post.author_handle}`}>
                        <Image
                          src={post.author_pfp ?? "/default-pfp.png"}
                          alt={`@${post.author_handle} profile picture`}
                          width={64}
                          height={64}
                        />
                      </Link>
                    ) : (
                      <Image
                        src={post.author_pfp ?? "/default-pfp.png"}
                        alt="Profile"
                        width={64}
                        height={64}
                      />
                    )}
                  </div>
                  <div>
                    <p className="post-meta">
                      <strong className="emboss">
                        {post.author_handle ? (
                          <Link href={`/${post.author_handle}`}>
                            {post.author_name?.trim() || `@${post.author_handle}`}
                          </Link>
                        ) : (
                          post.author_name?.trim() || "Unknown"
                        )}
                      </strong>{" "}
                      <small>
                        {statusHandle &&
                        post.author_handle === statusHandle &&
                        post.profile_handle === statusHandle
                          ? "updated their status at"
                          : "wrote at"}{" "}
                        {new Date(post.posted_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </small>
                    </p>
                    <p className="post-body">{post.body}</p>
                    {/* <small>
                      <Link href={`/${post.author_handle ?? ""}`}>
                        {`Write on @${post.author_handle ?? "this"}'s wall`}
                      </Link>
                    </small> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
