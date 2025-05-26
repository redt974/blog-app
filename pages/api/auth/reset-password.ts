import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextApiRequest, NextApiResponse } from "next"
import { transporter } from "@/lib/mailer"
import { passwordResetConfirmationTemplate } from "@/templates/reset-password"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée." })
  }

  const { token, email, password } = req.body

  if (!token || !email || !password) {
    return res.status(400).json({ message: "Champs manquants." })
  }

  // Vérifie le token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken || resetToken.email !== email || resetToken.expires < new Date()) {
    return res.status(400).json({ message: "Lien invalide ou expiré." })
  }

  // Hash du nouveau mot de passe
  const hashedPassword = await hash(password, 12)

  // Mise à jour du mot de passe
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  })

  // Supprimer le token
  await prisma.passwordResetToken.delete({
    where: { token },
  })

  // Envoyer un email de confirmation
  const { subject, html } = passwordResetConfirmationTemplate({ email })

  await transporter.sendMail({
    from: `"MonApp" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html,
  })

  return res.status(200).json({ message: "Mot de passe réinitialisé avec succès." })
}
