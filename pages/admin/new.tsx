import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/Layout"
import useIsAdmin from "@/lib/hooks/use-is-admin"
import Loader from "@/components/Loader";
import { motion } from "framer-motion"
import { toast } from 'react-toastify'
import { PlusCircle, Image as ImageIcon } from "lucide-react"
import AccessDenied from "@/pages/403";

export default function NewPost() {
  const isAdmin = useIsAdmin();
  const router = useRouter()
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (isAdmin === false) {
      setAccessDenied(true); // Affiche la page 403 personnalisée

      const timeout = setTimeout(() => {
        router.replace("/");
      }, 3000); // redirige après 3 secondes

      return () => clearTimeout(timeout);
    }
  }, [isAdmin]);

  if (isAdmin === null) return <Loader />;
  if (accessDenied) return <AccessDenied />;

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pdf, setPdf] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        toast.error("Image invalide : seuls les formats JPG, PNG ou WEBP sont autorisés.");
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
        toast.error("Seuls les fichiers PDF sont autorisés.");
        e.target.value = "";
        return;
      }

      setPdf(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);
    if (pdf) formData.append("pdf", pdf);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Si backend envoie message d’erreur
        toast.error(data.message || "Erreur lors de la création du post");
        return;
      }

      toast.success(data.message || "Annonce créée avec succès !");
      // Optionnel : rediriger après un délai ou directement
      setTimeout(() => router.push("/"), 1500);

    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      toast.error("Erreur réseau, veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/20 via-background to-background/90">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="relative overflow-hidden bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-blue-200/30 p-8 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-transparent"></div>

            <div className="space-y-2 text-center mb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-blue-700"
              >
                Créer une nouvelle annonce
              </motion.h1>
              <p className="text-sm text-black/60">
                Remplissez les détails de votre nouvelle annonce ci-dessous
              </p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-black/80 ml-1">
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
                      className="w-full px-4 py-3 bg-white/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 placeholder:text-black/40"
                    />
                    <div className="absolute inset-0 border border-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium text-black/80 ml-1">
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
                      className="w-full h-48 px-4 py-3 bg-white/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 resize-none placeholder:text-black/40"
                    />
                    <div className="absolute inset-0 border border-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-black/80 ml-1">
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
                      className="w-full px-4 py-3 bg-white/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 appearance-none placeholder:text-black/40"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="VTT">VTT</option>
                      <option value="Basket">Basket</option>
                      <option value="Boule">Boule</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Gym">Gymnastique</option>
                    </select>
                    <div className="absolute inset-0 border border-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-black/60">
                      ▼
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="block w-full text-sm text-black/70
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-black/70
                        hover:file:bg-blue-100
                        file:cursor-pointer file:transition-colors"
                    />
                    {imagePreview && (
                      <div className="mt-4 relative group">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-full max-h-[200px] object-contain rounded-lg border border-blue-200"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
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
                        file:bg-blue-50 file:text-black/70
                        hover:file:bg-blue-100
                        file:cursor-pointer file:transition-colors"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 bg-blue-500 text-black font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg"
              >
                <PlusCircle size={18} />
                {isSubmitting ? "Publication..." : "Publier l'annonce"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
