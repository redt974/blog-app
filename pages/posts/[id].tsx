import { GetServerSideProps } from "next"
import { prisma } from "@/lib/prisma"
import Layout from "@/components/Layout"

type Props = {
  post: {
    id: number
    title: string
    content: string
    createdAt: string
    updatedAt: string
    authorId?: string
  }
}

export default function PostPage({ post }: Props) {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">Publié le {new Date(post.createdAt).toLocaleDateString()}</p>
        <p>{post.content}</p>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  })

  if (!post) {
    return { notFound: true }
  }

  // Sérialisation des dates
  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }

  return {
    props: { post: serializedPost },
  }
}
