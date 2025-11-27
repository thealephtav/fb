import type { Post } from "@/lib/data";
import { ProfileRow } from "@/components/ProfileRow";

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
              <li key={post.id}>
                <ProfileRow
                  href={`/${post.author_handle}`}
                  name={post.author_name}
                  handle={post.author_handle}
                  pfp={post.author_pfp}
                  body={post.body}
                  subText={
                    post.author_handle === statusHandle && post.profile_handle === statusHandle
                      ? `updated their status at ${new Date(post.posted_at).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}`
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
