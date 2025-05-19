import { useState } from "react"

type Props = {
  posts: { id: number, title: string, content: string }[]
  onResults: (filtered: Props["posts"]) => void
}

export default function SearchBar({ posts, onResults }: Props) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    const results = posts.filter((post) =>
      post.title.toLowerCase().includes(q.toLowerCase()) ||
      post.content.toLowerCase().includes(q.toLowerCase())
    )
    onResults(results)
  }

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Rechercher..."
      className="w-full border p-2 rounded mb-4"
    />
  )
}
