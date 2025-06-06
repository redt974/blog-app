import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import Head from "next/head";
import { getCategoryEmoji } from "@/lib/category-emoji";
import { ArrowLeft } from "lucide-react";

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
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.slice(0, 150)} />
        {post.imageUrl && <meta property="og:image\" content={post.imageUrl} />}
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/posts/${post.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content.slice(0, 150)} />
        {post.imageUrl && <meta name="twitter:image\" content={post.imageUrl} />}
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Retour</span>
              </a>
            </div>

            <article className="bg-white rounded-2xl shadow-lg shadow-black/[0.03] border border-black/[0.05] overflow-hidden">
              {post.imageUrl && (
                <div className="relative h-[300px] sm:h-[400px] w-full">
                  <img
                    src={post.imageUrl}
                    alt={`Image principale de ${post.title}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{getCategoryEmoji(post.category)}</span>
                  <span className="text-sm font-medium text-black-600 bg-yellow-50 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h1>

                <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div className="prose prose-yellow max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {post.pdfUrl && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <a
                      href={post.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Télécharger le PDF
                    </a>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </Layout>
    </>
  );
}
