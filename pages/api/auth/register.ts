import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Champs requis manquants" })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return res.status(201).json({ message: "Utilisateur créé avec succès" })
  } catch (err) {
    console.error("Erreur création utilisateur :", err)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
