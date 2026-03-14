import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllPosts, getPostByDate } from "@/lib/posts"

export const dynamicParams = false

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ date: post.dateSlug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>
}): Promise<Metadata> {
  const { date } = await params
  const post = await getPostByDate(date)
  if (!post) return {}
  return { title: post.title }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  const post = await getPostByDate(date)
  if (!post) notFound()

  return (
    <div>
      <article>
        <header style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              lineHeight: 1.4,
              margin: "0 0 0.75rem",
            }}
          >
            {post.title}
          </h1>
          {post.summary && (
            <p style={{ margin: "0 0 0.75rem", color: "#555", lineHeight: 1.7 }}>
              {post.summary}
            </p>
          )}
          <div style={{ fontSize: "0.875rem", color: "#bbb" }}>
            {post.author && (
              <span style={{ marginRight: "0.5rem" }}>{post.author}</span>
            )}
            {post.author && <span style={{ marginRight: "0.5rem" }}>·</span>}
            {formatFullDate(post.date)}
          </div>
        </header>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <div style={{ marginTop: "3rem" }}>
        <Link href="/" style={{ fontSize: "0.875rem", color: "#888" }}>
          ← 返回
        </Link>
      </div>
    </div>
  )
}

function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  return `${y}年${m}月${d}日`
}
