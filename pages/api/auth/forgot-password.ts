import { prisma } from "@/lib/prisma"
import { transporter } from "@/lib/mailer"
import { randomBytes } from "crypto"
import { NextApiRequest, NextApiResponse } from "next"
import { passwordResetTemplate } from "@/templates/forgot-password"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") return res.status(405).end()

    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email requis." })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(200).json({ message: "Email envoyé si le compte existe." }) // Ne pas révéler si l'utilisateur existe

    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1h
    const url = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${email}`

    const { html, subject } = passwordResetTemplate({ url, email })

    await prisma.passwordResetToken.create({
        data: {
            token,
            email,
            expires,
        },
    })



    await transporter.sendMail({
        from: `"MonApp" <${process.env.GMAIL_USER}>`,
        to: email,
        subject,
        html,
    })


    return res.status(200).json({ message: "Email envoyé si le compte existe." })
}
