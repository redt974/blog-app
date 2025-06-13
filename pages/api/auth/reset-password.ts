import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next"
import { resend } from '@/lib/resend'
import { passwordResetConfirmationTemplate } from "@/templates/reset-password"
import { verifyCaptcha } from "@/lib/captcha"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée." })
  }

  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return res.status(403).json({ message: "Déjà connecté." });
  }
  
  const { token, email, password, captcha } = req.body

  if (!token || !email || !password || !captcha) {
    return res.status(400).json({ message: "Champs manquants." })
  }

  const isHuman = await verifyCaptcha(captcha);
  if (!isHuman.success || isHuman.score < 0.5) {
    return res.status(400).json({ message: "Échec de la vérification captcha." });
  }

  // Vérifie le token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken || resetToken.email !== email || resetToken.expires < new Date()) {
    return res.status(400).json({ message: "Lien invalide ou expiré." })
  }

  // Vérifie le format de l'email
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!%&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial." });
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
  const from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
  await resend.emails.send({
    from,
    to: email,
    subject,
    html,
  })

  return res.status(200).json({ message: "Mot de passe réinitialisé avec succès." })
}
