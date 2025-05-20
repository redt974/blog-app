import nodemailer from "nodemailer"
import { verifyEmailTemplate } from "@/templates/verify-email"

export const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: parseInt(process.env.GMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
})

export async function sendVerificationEmail(email: string, link: string, name?: string) {
  const { subject, html } = verifyEmailTemplate(link, name)

  await transporter.sendMail({
    from: `"Mon Blog App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html,
  })
}
