import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Non autorisé" })
  }

  const postId = parseInt(req.query.id as string)

  if (isNaN(postId)) {
    return res.status(400).json({ message: "ID invalide" })
  }

  try {
    switch (req.method) {
      case "PUT": {
        const { title, content, category } = req.body

        if (!title || !content || !category) {
          return res.status(400).json({ message: "Champs requis manquants" })
        }

        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { title, content },
        })

        await prisma.post.update({
          where: { id: postId },
          data: { title, content, category },
        })
        return res.status(200).json(updatedPost)
      }

      case "DELETE": {
        await prisma.post.delete({
          where: { id: postId },
        })
        return res.status(204).end()
      }

      default:
        res.setHeader("Allow", ["PUT", "DELETE"])
        return res.status(405).end(`Méthode ${req.method} non autorisée`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
