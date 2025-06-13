import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next"
import { verifyCaptcha } from "@/lib/captcha";
import { sendVerificationEmail } from "@/lib/resend"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return res.status(403).json({ message: "Déjà connecté." });
  }

  const { name, email, password, captcha } = req.body
  if (!email || !password || !captcha) {
    return res.status(400).json({ message: "Email et mot de passe requis." })
  }

  const isHuman = await verifyCaptcha(captcha);
  if (!isHuman.success || isHuman.score < 0.5) {
    return res.status(400).json({ message: "Échec de la vérification captcha." });
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(400).json({ message: "Cet email est déjà utilisé." })
  }

  // Vérifie le format de l'email
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!%&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial." });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h

  await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  const baseUrl = process.env.NEXTAUTH_URL
  const url = `${baseUrl}/auth/verify-email?token=${token}&email=${email}`

  try {
    await sendVerificationEmail(email, url, name)
    return res.status(200).json({ message: "Inscription réussie. Vérifiez votre email." })
  } catch (err) {
    console.error("Erreur envoi mail :", err)
    return res.status(500).json({ message: "Erreur lors de l'envoi de l'email de vérification." })
  }
}
