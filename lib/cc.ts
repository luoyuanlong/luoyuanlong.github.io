import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"

const ccDirectory = path.join(process.cwd(), "content/cc")

export interface CcPost {
  slug: string
  title: string
  date: string
  dateSlug: string
  author?: string
  summary?: string
  contentHtml: string
}

export function getAllCcPosts(): Omit<CcPost, "contentHtml">[] {
  if (!fs.existsSync(ccDirectory)) return []

  const fileNames = fs.readdirSync(ccDirectory).filter((n) => n.endsWith(".md"))

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "")
    const fullPath = path.join(ccDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)
    const date = toDateString(data.date)

    return {
      slug,
      title: data.title as string,
      date,
      dateSlug: date.replace(/-/g, ""),
      author: data.author as string | undefined,
      summary: data.summary as string | undefined,
    }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

function toDateString(raw: unknown): string {
  if (raw instanceof Date) {
    const y = raw.getUTCFullYear()
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0")
    const d = String(raw.getUTCDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }
  return String(raw)
}

export async function getCcPostByDate(dateSlug: string): Promise<CcPost | null> {
  if (!fs.existsSync(ccDirectory)) return null

  const fileNames = fs.readdirSync(ccDirectory).filter((n) => n.endsWith(".md"))

  for (const fileName of fileNames) {
    const fullPath = path.join(ccDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)
    const date = toDateString(data.date)

    if (date.replace(/-/g, "") !== dateSlug) continue

    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(content)

    return {
      slug: fileName.replace(/\.md$/, ""),
      title: data.title as string,
      date,
      dateSlug,
      author: data.author as string | undefined,
      summary: data.summary as string | undefined,
      contentHtml: processedContent.toString(),
    }
  }

  return null
}
