import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  posts: Post[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return { props: { posts: serializedPosts } };
};

export default function Home({ posts }: Props) {
  const { data: session } = useSession();

  // États pour la recherche et le filtre catégorie
  const [searchResults, setSearchResults] = useState(posts);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Liste unique des catégories
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  // Filtrer à la volée quand change la catégorie
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    // Si on a du texte dans la barre de recherche, on combine les filtres
    setSearchResults(
      posts.filter((p) => {
        const matchCat = cat === "" || p.category === cat;
        const matchSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      })
    );
  };

  // Garder la dernière query pour le filtre mixte
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (results: Post[], query: string) => {
    setSearchQuery(query);
    // Combine avec le filtre catégorie actuel
    setSearchResults(
      results.filter(
        (p) => selectedCategory === "" || p.category === selectedCategory
      )
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Dernières annonces
        </h1>

        {/* Barre de recherche */}
        <SearchBar
          posts={posts}
          onResults={(r) => handleSearch(r, searchQuery)}
        />

        {/* Filtre par catégorie */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="category"
            className="text-base font-medium text-gray-700"
          >
            Filtrer par catégorie :
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="space-y-6">
          {searchResults.length > 0 ? (
            searchResults.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-5"
              >
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-2xl font-semibold text-blue-700 hover:underline cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {post.content.slice(0, 150)}
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  Catégorie :{" "}
                  <span className="font-semibold text-gray-800">
                    {post.category}
                  </span>
                </p>

                {session?.user && (
                  <div className="mt-4 flex gap-6 text-sm">
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="text-green-600 hover:underline hover:text-green-800 transition"
                    >
                      ✏️ Modifier
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch(`/api/posts/${post.id}`, {
                          method: "DELETE",
                        });
                        window.location.reload();
                      }}
                      className="text-red-600 hover:underline hover:text-red-800 transition"
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center italic">
              Aucune annonce disponible.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
