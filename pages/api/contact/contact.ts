import { prisma } from "@/lib/prisma"
import { contactMessageTemplate } from "@/templates/contact-message"
import { getAuthUser } from "@/lib/auth" // ✅ Ajouté
import { resend } from '@/lib/resend'

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { name, object, email, message } = req.body

  if (!name || !object || !email || !message) {
    return res.status(400).json({ error: "Champs requis manquants" })
  }

  try {
    const user = await getAuthUser(req, res) // ✅ Ajouté

    // Enregistre en base
    await prisma.contactMessage.create({
      data: {
        name,
        object,
        email,
        message,
        // userId: user.id, // ✅ si tu veux relier le message à l'utilisateur
      },
    })

    // Crée le contenu de l'e-mail
    const { subject, html } = contactMessageTemplate(name, object, email, message)

    // Envoie l'e-mail au destinataire
     const from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
      await resend.emails.send({
      from,
      to: process.env.CONTACT_TO_EMAIL!,
      subject,
      html,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    if (err.message === "UNAUTHORIZED") return res.status(401).end()
    console.error("Erreur API contact :", err)
    return res.status(500).json({ error: "Erreur serveur" })
  }
}
