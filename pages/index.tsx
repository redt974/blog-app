import { GetServerSideProps } from "next"
import { prisma } from "../lib/prisma"
import { useState } from "react"
import { useSession } from "next-auth/react"
import Layout from "@/components/Layout"
import SearchBar from "@/components/SearchBar"
import Link from "next/link"

type Post = {
  id: number
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

type Props = {
  posts: Post[]
}

export const getServerSideProps: GetServerSideProps = async () => {

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  })

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  return { props: { posts: serializedPosts } }
}


export default function Home({ posts }: Props) {
  const { data: session } = useSession()

  // États pour la recherche et le filtre catégorie
  const [searchResults, setSearchResults] = useState(posts)
  const [selectedCategory, setSelectedCategory] = useState("")

  // Liste unique des catégories
  const categories = Array.from(new Set(posts.map((p) => p.category)))

  // Filtrer à la volée quand change la catégorie
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    // Si on a du texte dans la barre de recherche, on combine les filtres
    setSearchResults(
      posts.filter((p) => {
        const matchCat = cat === "" || p.category === cat
        const matchSearch = p.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase())
        return matchCat && matchSearch
      })
    )
  }

  // Garder la dernière query pour le filtre mixte
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (results: Post[], query: string) => {
    setSearchQuery(query)
    // Combine avec le filtre catégorie actuel
    setSearchResults(
      results.filter((p) => selectedCategory === "" || p.category === selectedCategory)
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Dernières annonces</h1>

        {/* Barre de recherche */}
        <SearchBar posts={posts} onResults={(r) => handleSearch(r, searchQuery)} />

        {/* Filtre par catégorie */}
        <div>
          <label htmlFor="category" className="mr-2 font-medium">
            Filtrer par catégorie :
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Toutes</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Résultats */}
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((post) => (
              <div key={post.id} className="border rounded p-4 hover:shadow">
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-xl font-semibold cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mt-1">
                  {post.content.slice(0, 100)}…
                </p>
                <p className="mt-2 text-sm text-blue-600">
                  Catégorie : <span className="font-medium">{post.category}</span>
                </p>

                {session?.user && (
                  <div className="mt-2 flex gap-4 text-sm">
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="text-green-600 hover:underline"
                    >
                      ✏️ Modifier
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
                        // recharge la page pour retirer le post
                        window.location.reload()
                      }}
                      className="text-red-600 hover:underline"
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucune annonce disponible.</p>
          )}
        </div>
      </div>
    </Layout>
  )
}