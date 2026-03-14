import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s · 渊默雷声",
    default: "渊默雷声",
  },
  description: "渊默雷声 — 个人博客",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: "3rem 1.5rem",
          }}
        >
          <header style={{ marginBottom: "3rem" }}>
            <Link
              href="/"
              style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.05em" }}
            >
              渊默雷声
            </Link>
            <nav style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "#888" }}>
              <Link href="/" style={{ marginRight: "1.25rem" }}>
                文章
              </Link>
              <Link href="/about">关于</Link>
            </nav>
          </header>

          <main>{children}</main>

          <footer
            style={{
              marginTop: "4rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #eee",
              fontSize: "0.85rem",
              color: "#bbb",
            }}
          >
            © {new Date().getFullYear()} 渊默雷声
          </footer>
        </div>
      </body>
    </html>
  )
}
