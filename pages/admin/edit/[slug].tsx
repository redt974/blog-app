import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { isAdminFromSession } from "@/lib/auth/is-admin";
import useIsAdmin from "@/lib/hooks/use-is-admin";
import { motion } from "framer-motion";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";

type Props = {
  post: {
    id: number;
    title: string;
    content: string;
    slug: string;
    category: string;
    imageUrl?: string | null;
    pdfUrl?: string | null;
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isAdmin = await isAdminFromSession(context.req, context.res);
  if (!isAdmin) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const slug = context.params?.slug as string;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return { notFound: true };

  return {
    props: {
      post: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    },
  };
};

export default function EditPost({ post }: Props) {
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    post.imageUrl || null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    post.imageUrl
  );
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(post.pdfUrl || null);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidFile = (file: File, allowedExtensions: string[], allowedMimeTypes: string[]) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isExtensionValid = allowedExtensions.includes(fileExtension || "");
    const isMimeValid = allowedMimeTypes.includes(file.type);

    return isExtensionValid && isMimeValid;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!isValidFile(file, allowedExtensions, allowedMimeTypes)) {
        alert("Image invalide : seuls les formats JPG, PNG ou WEBP sont autorisés.");
        e.target.value = ""; // reset input
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isValid = file.type === "application/pdf" && file.name.endsWith(".pdf");
      if (!isValid) {
        alert("Seuls les fichiers PDF sont autorisés.");
        e.target.value = "";
        return;
      }

      setPdf(file);
    }
  };

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
    const toastId = toast.loading("Suppression en cours...");
    setIsSubmitting(true);
    try {
      await fetch(`/api/posts/${post.slug}`, { method: "DELETE" });
      toast.update(toastId, {
        render: "Annonce supprimée avec succès",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.update(toastId, {
        render: "Erreur lors de la suppression",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-400/20 via-background to-background/90">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="relative overflow-hidden bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-yellow-200/30 p-8 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent"></div>

            <div className="space-y-2 text-center mb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-yellow-700"
              >
                Modifier l'annonce
              </motion.h1>
              <p className="text-sm text-black/60">
                Modifiez les détails de votre annonce ci-dessous
              </p>
            </div>

            <form
              onSubmit={handleUpdate}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-black/80 ml-1"
                  >
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
                      className="w-full px-4 py-3 bg-white/50 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-400 transition-all duration-200 placeholder:text-black/40"
                    />
                    <div className="absolute inset-0 border border-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="text-sm font-medium text-black/80 ml-1"
                  >
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
                      className="w-full h-48 px-4 py-3 bg-white/50 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-400 transition-all duration-200 resize-none placeholder:text-black/40"
                    />
                    <div className="absolute inset-0 border border-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-black/80 ml-1"
                  >
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
                      className="w-full px-4 py-3 bg-white/50 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-400 transition-all duration-200 appearance-none placeholder:text-black/40"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="VTT">VTT</option>
                      <option value="Basket">Basket</option>
                      <option value="Boule">Boule</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Gym">Gymnastique</option>
                    </select>
                    <div className="absolute inset-0 border border-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-black/60">
                      ▼
                    </div>
                  </motion.div>
                </div>

                {imagePreview && !filesToDelete.includes("image") && (
                  <div className="mb-4 relative group">
                    <label className="block text-sm font-medium text-black/80 mb-2">
                      Image actuelle :
                    </label>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Image principale"
                        className="w-full max-h-[200px] object-contain rounded-lg border border-yellow-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFilesToDelete((prev) => [...prev, "image"]);
                        setImagePreview(null);
                        setImageUrl(null);
                      }}
                      className="mt-2 text-sm px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-black/70 rounded transition-colors"
                    >
                      Supprimer l'image
                    </button>
                  </div>
                )}

                {pdfUrl && !filesToDelete.includes("pdf") && (
                  <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                    <label className="block text-sm font-medium text-black/80 mb-2">
                      PDF existant :
                    </label>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-700 hover:text-yellow-800 underline block mb-2"
                    >
                      {pdfUrl.split("/").pop()}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setFilesToDelete((prev) => [...prev, "pdf"]);
                        setPdfUrl(null);
                      }}
                      className="text-sm px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-black/70 rounded transition-colors"
                    >
                      Supprimer le PDF
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-black/70
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-yellow-50 file:text-black/70
                        hover:file:bg-yellow-100
                        file:cursor-pointer file:transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      name="pdf"
                      accept="application/pdf"
                      onChange={handlePdfChange}
                      className="block w-full text-sm text-black/70
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-yellow-50 file:text-black/70
                        hover:file:bg-yellow-100
                        file:cursor-pointer file:transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-yellow-500 text-black font-medium hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg"
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
                  className="w-full sm:w-auto px-8 py-3 bg-black/90 text-white font-medium hover:bg-black transition-all duration-200 shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg"
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
  );
}
