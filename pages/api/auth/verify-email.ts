import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { token, email } = req.body
  if (!token || !email) return res.status(400).json({ message: "Données manquantes." })

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  })

  if (!record || record.email !== email || record.expires < new Date()) {
    return res.status(400).json({ message: "Lien invalide ou expiré." })
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

  await prisma.emailVerificationToken.delete({ where: { token } })

  return res.status(200).json({ message: "Email vérifié." })
}
