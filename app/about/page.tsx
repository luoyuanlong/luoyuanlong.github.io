import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "关于",
}

export default function About() {
  return (
    <article className="prose">
      <h1>关于</h1>
      <p>这里是渊默雷声。</p>
      <p>
        沉默如渊，发声如雷。写作是思考的延伸，这个博客记录我对人、对世界、对自己的观察与思考。
      </p>
    </article>
  )
}
