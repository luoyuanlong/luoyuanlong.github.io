import type { Metadata } from "next"
import { quotes } from "@/data/quotes"

export const metadata: Metadata = {
  title: "摘录",
}

export default function QuotesPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "2rem" }}>
        摘录
      </h1>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {quotes.map((q, i) => (
          <li
            key={i}
            style={{
              marginBottom: "2rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid #eee",
            }}
          >
            <p style={{ margin: "0 0 0.4rem", lineHeight: 1.7 }}>{q.text}</p>
            {(q.author || q.source) && (
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>
                —{q.author && ` ${q.author}`}
                {q.source && `，《${q.source}》`}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
