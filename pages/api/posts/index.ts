import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === "POST") {
    if (!session) {
      return res.status(401).json({ message: "Non autorisé" })
    }

    const { title, content, category } = req.body

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Champs requis manquants" })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
      },
    })
    return res.status(201).json(post)
  }

  if (req.method === "GET") {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } })
    return res.status(200).json(posts)
  }

  res.setHeader("Allow", ["GET", "POST"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
