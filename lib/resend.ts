import { Resend } from 'resend'
import { verifyEmailTemplate } from "@/templates/verify-email"

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, link: string, name?: string) {
  const { subject, html } = verifyEmailTemplate(link, name)
 const from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
      await resend.emails.send({
    from,
    to: email,
    subject,
    html,
  })
}