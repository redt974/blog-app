import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function handler(req, res) {
  try {
    const user = await getAuthUser(req, res)

    if (req.method === 'GET') {
      return res.status(200).json({
        newsletterSubscribed: user.newsletterSubscribed,
      })
    }

    if (req.method === 'PUT') {
      const { subscribed } = req.body

      await prisma.user.update({
        where: { id: user.id },
        data: { newsletterSubscribed: subscribed },
      })

      return res.status(200).json({ ok: true })
    }

    return res.status(405).end()
  } catch (err) {
    if (err.message === "UNAUTHORIZED") return res.status(401).end()
    if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: "Utilisateur introuvable" })
    console.error(err)
    return res.status(500).json({ error: "Erreur serveur" })
  }
}
