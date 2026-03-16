import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { newsBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await client.fetch(newsBySlugQuery, { slug });

  if (!post) {
    return (
      <main className="section">
        <div className="container">
          <h1>News item not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="article-shell">
          <Link href="/news" className="back-link">
            ← Back to News
          </Link>

          <header className="article-header">
            <p className="article-kicker">News</p>
            <h1 className="article-title">{post.title}</h1>

            <div className="article-meta">
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </header>

          {post.coverImage && (
  <img
    src={urlFor(post.coverImage)
      .width(900)
      .height(500)
      .fit("crop")
      .auto("format")
      .url()}
    alt={post.title}
    className="article-image"
  />
)}

          {post.excerpt && <p className="article-lead">{post.excerpt}</p>}

          <article className="article-body">
            {post.body ? <p>{post.body}</p> : <p>No content available.</p>}
          </article>
        </div>
      </div>
    </main>
  );
}