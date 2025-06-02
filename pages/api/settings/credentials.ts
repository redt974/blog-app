import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcryptjs"

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end()

  try {
    const user = await getAuthUser(req, res)
    const { currentPassword, newPassword } = req.body

    if (!user.password || !(await compare(currentPassword, user.password))) {
      return res.status(403).json({ error: 'Mot de passe incorrect' })
    }

    const hashedPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    if (err.message === "UNAUTHORIZED") return res.status(401).end()
    if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: "Utilisateur introuvable" })
    console.error(err)
    return res.status(500).json({ error: "Erreur serveur" })
  }
}
