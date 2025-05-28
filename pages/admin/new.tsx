import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/Layout"
import useIsAdmin from "@/lib/hooks/use-is-admin"
import Loader from "@/components/Loader";

export default function NewPost() {
  const isAdmin = useIsAdmin();
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/");
    }
  }, [isAdmin]);

  if (isAdmin === null) return <Loader/>;
  if (isAdmin === false) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    })
    router.push("/")
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Créer une nouvelle annonce</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="VTT">VTT</option>
            <option value="Basket">Basket</option>
            <option value="Boule">Boule</option>
            <option value="Tennis">Tennis</option>
            <option value="Gym">Gymnastique</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Publier
          </button>
        </form>
      </div>
    </Layout>
  )
}
