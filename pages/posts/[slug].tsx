import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import Head from "next/head";
import { getCategoryEmoji } from "@/lib/category-emoji";

type Props = {
  post: {
    id: number;
    title: string;
    content: string;
    category: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string | null;
    pdfUrl?: string | null;
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      imageUrl: true,
      pdfUrl: true,
    },
  });

  if (!post) {
    return { notFound: true };
  }

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

export default function PostPage({ post }: Props) {
  return (
    <>
      <Head>
        <title>{`${post.title} - Club Sportif de Pierrelaye `}</title>
        <meta name="description" content={post.content.slice(0, 150)} />

        {/* Balises Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.slice(0, 150)} />
        {post.imageUrl && (
          <meta property="og:image" content={post.imageUrl} />
        )}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/posts/${post.slug}`} />

        {/* Balises Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content.slice(0, 150)} />
        {post.imageUrl && (
          <meta name="twitter:image" content={post.imageUrl} />
        )}
      </Head>

      <Layout>
        <div className="max-w-3xl mx-auto py-8 px-4">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={`Image principale de ${post.title}`}
              className="mb-4 rounded-lg max-h-96 w-full object-cover"
            />
          )}

          <h1 className="text-3xl font-bold mb-2">{getCategoryEmoji(post.category)} {post.title}</h1>

          <p className="text-sm text-gray-500 mb-4">
            Publié le {new Date(post.createdAt).toLocaleDateString()}
          </p>

          <p>{post.content}</p>

          {post.pdfUrl && (
            <p className="mt-6">
              <a
                href={post.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Télécharger la pièce jointe PDF
              </a>
            </p>
          )}
        </div>
      </Layout>
    </>
  );
}
