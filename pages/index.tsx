import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/SportsSlider"
import useIsAdmin from "@/lib/hooks/use-is-admin";
import { getCategoryEmoji } from "@/lib/category-emoji";
import { Bell, Search, Filter, ChevronDown, Edit, Trash2, ChevronRight, ChevronUp } from 'lucide-react';

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
  const [showAll, setShowAll] = useState(false);

  // Liste unique des catégories
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  // Filtrer à la volée quand change la catégorie
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setShowAll(false);
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
    setShowAll(false);
    // Combine avec le filtre catégorie actuel
    setSearchResults(
      results.filter(
        (p) => selectedCategory === "" || p.category === selectedCategory
      )
    );
  };

  // Determine which posts to display
  const displayedPosts = showAll ? searchResults : searchResults.slice(0, 6);
  const hasMorePosts = searchResults.length > 6;

  return (
     <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                  <span className="inline-block transform -rotate-2">
                    Actualités du Club
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-blue-100 mt-4 max-w-xl">
                  Découvrez les dernières annonces et événements de notre club sportif
                </p>
              </div>
              <div className="hidden md:block mt-8 md:mt-0">
                <Bell className="h-24 w-24 text-blue-100 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
            {/* Search and Filter */}
            <div className="space-y-6">
              <SearchBar
                posts={posts}
                onResults={(r, q) => handleSearch(r, q)}
              />

              {/* Filtre par catégorie */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-gray-700">
                  <Filter className="h-5 w-5 mr-2" />
                  <span className="font-medium">Filtrer par catégorie:</span>
                </div>
                <div className="relative flex-grow max-w-xs">
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="appearance-none w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getCategoryEmoji(cat)} {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Results */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="relative">
                Dernières annonces
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded"></span>
              </span>
              {searchResults.length > 0 && (
                <span className="ml-3 text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {searchResults.length}
                </span>
              )}
            </h2>

            {/* Results grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="h-2 bg-gradient-to-r from-blue-700 to-blue-900"></div>
                    <div className="p-6">
                      <a href={`/posts/${post.slug}`} className="block">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {getCategoryEmoji(post.category)} {post.title}
                        </h3>
                      </a>
                      <p className="text-gray-600 mt-3 text-base leading-relaxed line-clamp-3">
                        {post.content}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
                            {getCategoryEmoji(post.category)} {post.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>

                        {session?.user && isAdmin && (
                          <div className="mt-4 flex gap-4">
                            <a
                              href={`/admin/edit/${post.slug}`}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4" />
                              Modifier
                            </a>
                            <button
                              onClick={async () => {
                                await fetch(`/api/posts/${post.slug}`, {
                                  method: "DELETE",
                                });
                                window.location.reload();
                              }}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 px-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      Aucune annonce disponible.
                    </p>
                    <p className="text-gray-400 mt-2">
                      Essayez de modifier vos critères de recherche.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* See More Button */}
              {hasMorePosts && (
              <div className="flex justify-center mb-12">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <span>{showAll ? 'Voir moins' : 'Voir plus'}</span>
                  {showAll ? (
                    <ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        <Slider />
      </div>
    </Layout>

  );
}
