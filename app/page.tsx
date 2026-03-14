import { getAllPosts } from "@/lib/posts"
import Link from "next/link"

export default function Home() {
  const posts = getAllPosts()

  // 按年份分组
  const byYear = posts.reduce<Record<number, typeof posts>>((acc, post) => {
    const year = parseInt(post.date.split("-")[0])
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div>
      {years.map((year) => (
        <section key={year} style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#bbb",
              marginBottom: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            {year}
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {byYear[year].map((post) => (
              <li
                key={post.slug}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1.25rem",
                  marginBottom: "0.6rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#bbb",
                    minWidth: "3.5rem",
                    flexShrink: 0,
                  }}
                >
                  {formatMonthDay(post.date)}
                </span>
                <Link href={`/e/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {posts.length === 0 && (
        <p style={{ color: "#999" }}>还没有文章。</p>
      )}
    </div>
  )
}

function formatMonthDay(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number)
  return `${m}月${d}日`
}
