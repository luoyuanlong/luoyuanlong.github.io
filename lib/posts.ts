import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"

const postsDirectory = path.join(process.cwd(), "content/posts")

export interface Post {
  slug: string
  title: string
  date: string
  contentHtml: string
}

export function getAllPosts(): Omit<Post, "contentHtml">[] {
  const fileNames = fs.readdirSync(postsDirectory)

  const posts = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title as string,
        date: toDateString(data.date),
      }
    })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

// gray-matter 会把 YAML 日期自动解析为 Date 对象，统一转为 "YYYY-MM-DD" 字符串
function toDateString(raw: unknown): string {
  if (raw instanceof Date) {
    const y = raw.getUTCFullYear()
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0")
    const d = String(raw.getUTCDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }
  return String(raw)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)

  return {
    slug,
    title: data.title as string,
    date: toDateString(data.date),
    contentHtml: processedContent.toString(),
  }
}
