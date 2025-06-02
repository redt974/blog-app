import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { prisma } from "@/lib/prisma"
import Layout from "@/components/Layout"
import { getSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { isAdminFromSession } from "@/lib/auth/is-admin";
import useIsAdmin from "@/lib/hooks/use-is-admin";
import { motion } from "framer-motion"
import { Pencil, Trash2 } from "lucide-react"
import Loader from "@/components/Loader"

type Props = {
  post: {
    id: number
    title: string
    content: string
    slug: string
    category: string
    imageUrl?: string | null
    pdfUrl?: string | null
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isAdmin = await isAdminFromSession(context.req, context.res);
  if (!isAdmin) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      },
    }
  }

  const slug = context.params?.slug as string;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return { notFound: true }

  return {
    props: {
      post: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    },
  }
}

export default function EditPost({ post }: Props) {
  const isAdmin = useIsAdmin();
  const router = useRouter()

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [category, setCategory] = useState(post.category)
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(post.imageUrl || null)
  const [pdf, setPdf] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(post.pdfUrl || null)
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/");
    }
  }, [isAdmin]);

  if (isAdmin === null) return <Loader />;
  if (isAdmin === false) return null;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image && !imageUrl) {
      alert("L'image principale est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("filesToDelete", JSON.stringify(filesToDelete));
    if (image) formData.append("image", image);
    if (pdf) formData.append("pdf", pdf);

    try {
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      const data = await res.json();
      const newSlug = data.slug || post.slug;
      router.push(`/posts/${newSlug}`);
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      setIsSubmitting(true)
      try {
        await fetch(`/api/posts/${post.slug}`, { method: "DELETE" })
        router.push("/")
      } catch (error) {
        console.error("Error deleting post:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (status === "loading") {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-blue-500/20"></div>
            <div className="text-lg font-medium text-muted-foreground">Chargement...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (status === "unauthenticated") router.push("/api/auth/signin")

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-background to-background/90">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="relative overflow-hidden bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-blue-200/30 p-8 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 via-blue-400/30 to-transparent"></div>

            <div className="space-y-2 text-center mb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500"
              >
                Modifier l'annonce
              </motion.h1>
              <p className="text-sm text-blue-600/60">
                Modifiez les détails de votre annonce ci-dessous
              </p>
            </div>

            <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-blue-900/80 ml-1">
                    Titre
                  </label>
                  <motion.div
                    whileTap={{ scale: 0.995 }}
                    className="relative group"
                  >
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titre de l'annonce"
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 placeholder:text-blue-400/60"
                    />
                    <div className="absolute inset-0 border border-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium text-blue-900/80 ml-1">
                    Contenu
                  </label>
                  <motion.div
                    whileTap={{ scale: 0.995 }}
                    className="relative group"
                  >
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Contenu de l'annonce"
                      required
                      className="w-full h-48 px-4 py-3 bg-white/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 resize-none placeholder:text-blue-400/60"
                    />
                    <div className="absolute inset-0 border border-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-blue-900/80 ml-1">
                    Catégorie
                  </label>
                  <motion.div
                    whileTap={{ scale: 0.995 }}
                    className="relative group"
                  >
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 appearance-none placeholder:text-blue-400/60"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="VTT">VTT</option>
                      <option value="Basket">Basket</option>
                      <option value="Boule">Boule</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Gym">Gymnastique</option>
                    </select>
                    <div className="absolute inset-0 border border-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {imageUrl && !image && (
                  <div className="mb-4">
                    <label>Image principale existante :</label>
                    <img src={imageUrl} alt="Image principale" className="max-w-xs" />
                    <button type="button" onClick={() => { setFilesToDelete([...filesToDelete, imageUrl]); setImageUrl(null); }}>
                      Supprimer l'image principale
                    </button>
                  </div>
                )}

                {pdfUrl && !pdf && (
                  <div className="mb-4">
                    <label>PDF existant :</label>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{pdfUrl.split('/').pop()}</a>
                    <button type="button" onClick={() => { setFilesToDelete([...filesToDelete, pdfUrl]); setPdfUrl(null); }}>
                      Supprimer le PDF
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <input
                  type="file"
                  name="pdf"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files?.[0] || null)}
                />

              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Pencil size={18} />
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-red-500/90 text-white font-medium hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                  {isSubmitting ? "Suppression..." : "Supprimer"}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}