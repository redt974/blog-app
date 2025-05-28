import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { prisma } from "@/lib/prisma"
import Layout from "@/components/Layout"
import { getSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { isAdminFromSession } from "@/lib/auth/is-admin";
import useIsAdmin from "@/lib/hooks/use-is-admin";
import { Loader } from "lucide-react"

type Props = {
  post: {
    id: number
    title: string
    content: string
    category: string
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

  const id = context.params?.id
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  })

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

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/");
    }
  }, [isAdmin]);

  if (isAdmin === null) return <Loader/>;
  if (isAdmin === false) return null;


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    })
    router.push("/")
  }

  const handleDelete = async () => {
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
    router.push("/")
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Modifier l’annonce</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
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
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
