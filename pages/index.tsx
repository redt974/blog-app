import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import Slider from "@/components/SportsSlider"
import useIsAdmin from "@/lib/hooks/use-is-admin";
import { getCategoryEmoji } from "@/lib/category-emoji";

type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  slug: string;
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
  const isAdmin = useIsAdmin();
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
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        <h1 className="text-4xl font-bold font-libre text-black">
           Dernières annonces
        </h1>

        {/* Barre de recherche */}
        <SearchBar
          posts={posts}
          onResults={(r) => handleSearch(r, searchQuery)}
        />

        {/* Filtre par catégorie */}
        <div className="flex flex-wrap items-center gap-4">
          <label
            htmlFor="category"
            className="text-base font-medium text-gray-700"
          >
            Filtrer par catégorie :
          </label>
          <div className="relative">
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="appearance-none bg-white w-full pl-4 pr-10 py-2.5 border-0 rounded-lg text-gray-700 font-medium shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="">Toutes</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>


        {/* Résultats */}
        <div className="space-y-6">
          {searchResults.length > 0 ? (
            searchResults.map((post) => (
              <div
                key={post.slug}
                className="group bg-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-yellow-400 to-yellow-600"></div>
                <div className="ml-3">
                  <Link href={`/posts/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 group-hover:translate-x-0.5 transform transition-transform">
                      {getCategoryEmoji(post.category)} {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mt-3 text-base leading-relaxed line-clamp-2">
                    {post.content.slice(0, 150)}
                  </p>
                  <div className="mt-4 flex items-center">
                    Catégorie :{" "}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-black-700">
                      {getCategoryEmoji(post.category)} {post.category}
                    </span>
                  </div>

                  {session?.user && isAdmin && (
                    <div className="mt-5 flex gap-4">
                      <Link
                        href={`/admin/edit/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                      >
                        <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-emerald-100">✏️</span>
                        Modifier
                      </Link>
                      <button
                        onClick={async () => {
                          await fetch(`/api/posts/${post.slug}`, {
                            method: "DELETE",
                          });
                          window.location.reload();
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors duration-200"
                      >
                        <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-rose-100">🗑</span>
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-gray-500 text-lg font-medium">
                Aucune annonce disponible.
              </p>
            </div>
          )}
        </div>
      </div>
      <Slider/>
    </Layout>
  );
}
