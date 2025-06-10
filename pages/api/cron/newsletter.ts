import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { newPostTemplate } from "@/templates/new-post"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await prisma.post.findMany({
      where: { newsletterSent: false },
    })

    if (posts.length === 0) {
      return res.status(200).json({ message: "Aucun post à envoyer" })
    }

    const subscribers = await prisma.user.findMany({
      where: {
        newsletterSubscribed: true,
        email: { not: null },
      },
      select: { email: true },
    })

    for (const post of posts) {
      const { subject, html } = newPostTemplate(post.title, post.content, post.category)
      const from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`

      await Promise.all(
        subscribers.map(({ email }) =>      
       resend.emails.send({
        from,
            to: email!,
            subject,
            html,
          })
        )
      )

      await prisma.post.update({
        where: { id: post.id },
        data: { newsletterSent: true },
      })
    }

    res.status(200).json({ message: `${posts.length} post(s) envoyés.` })
  } catch (err) {
    console.error("Erreur CRON newsletter :", err)
    res.status(500).json({ error: "Erreur serveur" })
  }
}
